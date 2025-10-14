-- Mobile Legends Community Platform Database Schema
-- Created: 2025-10-14
-- Version: 1.0.0

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    ign VARCHAR(100),
    current_rank VARCHAR(50),
    main_heroes JSON,
    role VARCHAR(50) DEFAULT 'User',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
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
    win_rate FLOAT DEFAULT 0.0,
    pick_rate FLOAT DEFAULT 0.0,
    ban_rate FLOAT DEFAULT 0.0,
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
    level INTEGER DEFAULT 1,
    stats JSON,
    talents JSON,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create build_guides table
CREATE TABLE IF NOT EXISTS build_guides (
    id SERIAL PRIMARY KEY,
    hero_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
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
    rating FLOAT DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    version VARCHAR(20) DEFAULT '1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    guide_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    parent_id INTEGER,
    likes INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guide_ratings table
CREATE TABLE IF NOT EXISTS guide_ratings (
    id SERIAL PRIMARY KEY,
    guide_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hero_counters table
CREATE TABLE IF NOT EXISTS hero_counters (
    id SERIAL PRIMARY KEY,
    hero_id INTEGER NOT NULL,
    counter_hero_id INTEGER NOT NULL,
    counter_type VARCHAR(20),
    win_rate FLOAT
);

-- Create hero_synergies table
CREATE TABLE IF NOT EXISTS hero_synergies (
    id SERIAL PRIMARY KEY,
    hero_id INTEGER NOT NULL,
    synergy_hero_id INTEGER NOT NULL,
    synergy_type VARCHAR(20),
    win_rate FLOAT
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    author_id INTEGER NOT NULL,
    category VARCHAR(50),
    tags JSON,
    image_url VARCHAR(500),
    views INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_heroes_name ON heroes(name);
CREATE INDEX IF NOT EXISTS idx_heroes_role ON heroes(role);
CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_emblems_name ON emblems(name);
CREATE INDEX IF NOT EXISTS idx_emblems_type ON emblems(type);
CREATE INDEX IF NOT EXISTS idx_build_guides_hero_id ON build_guides(hero_id);
CREATE INDEX IF NOT EXISTS idx_build_guides_author_id ON build_guides(author_id);
CREATE INDEX IF NOT EXISTS idx_build_guides_published ON build_guides(is_published);
CREATE INDEX IF NOT EXISTS idx_comments_guide_id ON comments(guide_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_guide_ratings_guide_id ON guide_ratings(guide_id);
CREATE INDEX IF NOT EXISTS idx_guide_ratings_user_id ON guide_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_hero_counters_hero_id ON hero_counters(hero_id);
CREATE INDEX IF NOT EXISTS idx_hero_synergies_hero_id ON hero_synergies(hero_id);
CREATE INDEX IF NOT EXISTS idx_news_author_id ON news(author_id);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(is_featured);

-- Grant permissions to ml_user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ml_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ml_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO ml_user;