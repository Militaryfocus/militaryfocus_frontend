-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    ign VARCHAR(100),
    current_rank VARCHAR(50),
    main_heroes JSON,
    role VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create heroes table
CREATE TABLE IF NOT EXISTS heroes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    lane JSON,
    durability INTEGER,
    offense INTEGER,
    control INTEGER,
    difficulty INTEGER,
    passive_skill JSON,
    first_skill JSON,
    second_skill JSON,
    ultimate_skill JSON,
    release_date VARCHAR(50),
    price JSON,
    image_url VARCHAR(500),
    avatar_url VARCHAR(500),
    win_rate FLOAT,
    pick_rate FLOAT,
    ban_rate FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    price INTEGER,
    category VARCHAR(50),
    stats JSON,
    passive_effect JSON,
    active_effect JSON,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create emblems table
CREATE TABLE IF NOT EXISTS emblems (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    level INTEGER,
    stats JSON,
    talents JSON,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create build_guides table
CREATE TABLE IF NOT EXISTS build_guides (
    id SERIAL PRIMARY KEY,
    hero_id INTEGER NOT NULL REFERENCES heroes(id),
    author_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    emblems JSON,
    battle_spell VARCHAR(100),
    item_build JSON,
    skill_priority JSON,
    play_style VARCHAR(50),
    difficulty VARCHAR(20),
    tags JSON,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    rating FLOAT,
    rating_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    version VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    guide_id INTEGER NOT NULL REFERENCES build_guides(id),
    author_id INTEGER NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    parent_id INTEGER REFERENCES comments(id),
    likes INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create guide_ratings table
CREATE TABLE IF NOT EXISTS guide_ratings (
    id SERIAL PRIMARY KEY,
    guide_id INTEGER NOT NULL REFERENCES build_guides(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hero_counters table
CREATE TABLE IF NOT EXISTS hero_counters (
    id SERIAL PRIMARY KEY,
    hero_id INTEGER NOT NULL REFERENCES heroes(id),
    counter_hero_id INTEGER NOT NULL REFERENCES heroes(id),
    counter_type VARCHAR(20),
    win_rate FLOAT
);

-- Create hero_synergies table
CREATE TABLE IF NOT EXISTS hero_synergies (
    id SERIAL PRIMARY KEY,
    hero_id INTEGER NOT NULL REFERENCES heroes(id),
    synergy_hero_id INTEGER NOT NULL REFERENCES heroes(id),
    synergy_type VARCHAR(20),
    win_rate FLOAT
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    author_id INTEGER NOT NULL REFERENCES users(id),
    category VARCHAR(50),
    tags JSON,
    image_url VARCHAR(500),
    views INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS ix_users_email ON users(email);
CREATE INDEX IF NOT EXISTS ix_users_username ON users(username);
CREATE INDEX IF NOT EXISTS ix_heroes_name ON heroes(name);
CREATE INDEX IF NOT EXISTS ix_items_name ON items(name);
CREATE INDEX IF NOT EXISTS ix_emblems_name ON emblems(name);
CREATE INDEX IF NOT EXISTS ix_build_guides_hero_id ON build_guides(hero_id);
CREATE INDEX IF NOT EXISTS ix_build_guides_author_id ON build_guides(author_id);
CREATE INDEX IF NOT EXISTS ix_comments_guide_id ON comments(guide_id);
CREATE INDEX IF NOT EXISTS ix_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS ix_guide_ratings_guide_id ON guide_ratings(guide_id);
CREATE INDEX IF NOT EXISTS ix_guide_ratings_user_id ON guide_ratings(user_id);
CREATE INDEX IF NOT EXISTS ix_hero_counters_hero_id ON hero_counters(hero_id);
CREATE INDEX IF NOT EXISTS ix_hero_synergies_hero_id ON hero_synergies(hero_id);
CREATE INDEX IF NOT EXISTS ix_news_author_id ON news(author_id);