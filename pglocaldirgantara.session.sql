-- -- DDL Users table
-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY,
--   full_name VARCHAR(100) NOT NULL,
--   username VARCHAR(50) UNIQUE NOT NULL,
--   email VARCHAR(100) UNIQUE NOT NULL,
--   password_hash VARCHAR(255) NOT NULL,
--   role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
--   profile_picture VARCHAR(255) DEFAULT 'user.jpg',
--   is_active BOOLEAN DEFAULT FALSE,
--   activation_code VARCHAR(255),
--   created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
-- );

-- INSERT INTO users (username, email, password_hash) VALUES 
-- ('daniel', 'damnil@gmail.com', 'b.12345678901234'),
-- ('dirgantara', 'dirgantara@gmail.com', 'b.12345678901234');

-- SELECT * FROM users;

-- SELECT * FROM users;
-- DELETE FROM users
-- WHERE id = 3;

-- -- 1. Main Anime Table
-- CREATE TABLE anime (
--     id SERIAL PRIMARY KEY,
--     anime_id INTEGER UNIQUE NOT NULL,
--     title TEXT,
--     title_english TEXT,
--     title_japanese TEXT,
--     title_synonyms TEXT[],
--     image_url TEXT,
--     type TEXT,
--     source TEXT,
--     episodes INTEGER,
--     status TEXT,
--     airing BOOLEAN,
--     aired_string TEXT,
--     aired JSONB,
--     duration TEXT,
--     rating TEXT,
--     score REAL,
--     scored_by INTEGER,
--     rank INTEGER,
--     popularity INTEGER,
--     members INTEGER,
--     favorites INTEGER,
--     background TEXT,
--     premiered TEXT,
--     broadcast TEXT
-- );

-- -- 2. Studios
-- CREATE TABLE studios (
--     id SERIAL PRIMARY KEY,
--     name TEXT UNIQUE
-- );
-- CREATE TABLE anime_studios (
--     anime_id INTEGER REFERENCES anime(anime_id) ON DELETE CASCADE,
--     studio_id INTEGER REFERENCES studios(id),
--     PRIMARY KEY (anime_id, studio_id)
-- );

-- -- 3. Producers
-- CREATE TABLE producers (
--     id SERIAL PRIMARY KEY,
--     name TEXT UNIQUE
-- );
-- CREATE TABLE anime_producers (
--     anime_id INTEGER REFERENCES anime(anime_id) ON DELETE CASCADE,
--     producer_id INTEGER REFERENCES producers(id),
--     PRIMARY KEY (anime_id, producer_id)
-- );

-- -- 4. Licensors
-- CREATE TABLE licensors (
--     id SERIAL PRIMARY KEY,
--     name TEXT UNIQUE
-- );
-- CREATE TABLE anime_licensors (
--     anime_id INTEGER REFERENCES anime(anime_id) ON DELETE CASCADE,
--     licensor_id INTEGER REFERENCES licensors(id),
--     PRIMARY KEY (anime_id, licensor_id)
-- );

-- -- 5. Genres
-- CREATE TABLE genres (
--     id SERIAL PRIMARY KEY,
--     name TEXT UNIQUE
-- );
-- CREATE TABLE anime_genres (
--     anime_id INTEGER REFERENCES anime(anime_id) ON DELETE CASCADE,
--     genre_id INTEGER REFERENCES genres(id),
--     PRIMARY KEY (anime_id, genre_id)
-- );

-- -- 6. Opening & Ending Themes
-- CREATE TABLE opening_themes (
--     id SERIAL PRIMARY KEY,
--     anime_id INTEGER REFERENCES anime(anime_id) ON DELETE CASCADE,
--     theme TEXT
-- );
-- CREATE TABLE ending_themes (
--     id SERIAL PRIMARY KEY,
--     anime_id INTEGER REFERENCES anime(anime_id) ON DELETE CASCADE,
--     theme TEXT
-- );

-- -- 7. Anime List
CREATE TABLE anime_lists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    anime_id INTEGER REFERENCES anime(anime_id) ON DELETE CASCADE,
    status TEXT,
    user_rating INTEGER CHECK (user_rating BETWEEN 0 AND 10),
    notes TEXT,
    UNIQUE(user_id, anime_id)
);

-- DROP TABLE anime_lists;

-- BEGIN;

-- -- Delete from junction tables and child tables
-- DELETE FROM opening_themes;
-- DELETE FROM ending_themes;
-- DELETE FROM anime_studios;
-- DELETE FROM anime_producers;
-- DELETE FROM anime_licensors;
-- DELETE FROM anime_genres;

-- -- Delete from anime (main table)
-- DELETE FROM anime;

-- -- Optional: Clear lookup tables too
-- DELETE FROM studios;
-- DELETE FROM producers;
-- DELETE FROM licensors;
-- DELETE FROM genres;


-- ALTER SEQUENCE studios_id_seq RESTART WITH 1;
-- ALTER SEQUENCE anime_id_seq RESTART WITH 1;
-- ALTER SEQUENCE producers_id_seq RESTART WITH 1;
-- ALTER SEQUENCE licensors_id_seq RESTART WITH 1;
-- ALTER SEQUENCE genres_id_seq RESTART WITH 1;

-- ALTER SEQUENCE opening_themes_id_seq RESTART WITH 1;
-- ALTER SEQUENCE ending_themes_id_seq RESTART WITH 1;

-- COMMIT;

-- SELECT * FROM anime
-- ORDER BY id ASC;

-- SELECT * FROM genres;
-- SELECT * FROM anime_genres;

-- SELECT * FROM pg_sequences WHERE schemaname = 'public';

