-- Инициализация базы данных Mobile Legends Community Platform

-- Создание расширений
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_heroes_name ON heroes(name);
CREATE INDEX IF NOT EXISTS idx_heroes_role ON heroes(role);
CREATE INDEX IF NOT EXISTS idx_heroes_specialty ON heroes(specialty);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_guides_hero_id ON build_guides(hero_id);
CREATE INDEX IF NOT EXISTS idx_guides_author_id ON build_guides(author_id);
CREATE INDEX IF NOT EXISTS idx_guides_rating ON build_guides(rating);
CREATE INDEX IF NOT EXISTS idx_guides_created_at ON build_guides(created_at);

CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at);

-- Создание полнотекстового поиска для героев
CREATE INDEX IF NOT EXISTS idx_heroes_search ON heroes USING gin(to_tsvector('english', name || ' ' || specialty));

-- Создание полнотекстового поиска для гайдов
CREATE INDEX IF NOT EXISTS idx_guides_search ON build_guides USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Создание полнотекстового поиска для новостей
CREATE INDEX IF NOT EXISTS idx_news_search ON news USING gin(to_tsvector('english', title || ' ' || COALESCE(content, '') || ' ' || COALESCE(summary, '')));

-- Создание триггеров для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Применение триггеров к таблицам
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_heroes_updated_at ON heroes;
CREATE TRIGGER update_heroes_updated_at BEFORE UPDATE ON heroes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_guides_updated_at ON build_guides;
CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON build_guides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_updated_at ON news;
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Создание представлений для статистики
CREATE OR REPLACE VIEW hero_stats AS
SELECT 
    h.id,
    h.name,
    h.role,
    h.specialty,
    COUNT(bg.id) as guides_count,
    AVG(bg.rating) as avg_guide_rating,
    SUM(bg.views) as total_views,
    SUM(bg.likes) as total_likes
FROM heroes h
LEFT JOIN build_guides bg ON h.id = bg.hero_id AND bg.is_published = true
GROUP BY h.id, h.name, h.role, h.specialty;

CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.username,
    u.role,
    COUNT(bg.id) as guides_count,
    AVG(bg.rating) as avg_guide_rating,
    SUM(bg.views) as total_views,
    SUM(bg.likes) as total_likes
FROM users u
LEFT JOIN build_guides bg ON u.id = bg.author_id AND bg.is_published = true
GROUP BY u.id, u.username, u.role;

-- Создание функции для поиска
CREATE OR REPLACE FUNCTION search_heroes(search_query text)
RETURNS TABLE(
    id integer,
    name text,
    role text,
    specialty text,
    rank real
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        h.id,
        h.name,
        h.role,
        h.specialty,
        ts_rank(to_tsvector('english', h.name || ' ' || h.specialty), plainto_tsquery('english', search_query)) as rank
    FROM heroes h
    WHERE to_tsvector('english', h.name || ' ' || h.specialty) @@ plainto_tsquery('english', search_query)
    ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql;

-- Создание функции для поиска гайдов
CREATE OR REPLACE FUNCTION search_guides(search_query text)
RETURNS TABLE(
    id integer,
    title text,
    description text,
    hero_id integer,
    author_id integer,
    rating real,
    views integer,
    rank real
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bg.id,
        bg.title,
        bg.description,
        bg.hero_id,
        bg.author_id,
        bg.rating,
        bg.views,
        ts_rank(to_tsvector('english', bg.title || ' ' || COALESCE(bg.description, '')), plainto_tsquery('english', search_query)) as rank
    FROM build_guides bg
    WHERE bg.is_published = true
    AND to_tsvector('english', bg.title || ' ' || COALESCE(bg.description, '')) @@ plainto_tsquery('english', search_query)
    ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql;