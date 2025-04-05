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


-- -- DDL Animes table
-- CREATE TABLE animes (
--     id SERIAL PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     description TEXT,
--     image_url VARCHAR(255),
--     episodes INTEGER,
--     status VARCHAR(20) CHECK (status IN ('Ongoing', 'Completed', 'Not yet aired')),
--     release_year INTEGER,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- DDL UserAnimeList table 
-- CREATE TABLE user_anime_list (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--     anime_id INTEGER REFERENCES animes(id) ON DELETE CASCADE,
--     status VARCHAR(20) CHECK (status IN ('Watching', 'Completed', 'Plan to Watch', 'Dropped')),
--     rating INTEGER CHECK (rating BETWEEN 1 AND 10),
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     UNIQUE(user_id, anime_id)
-- );

-- INSERT INTO users (username, email, password_hash) VALUES 
-- ('daniel', 'damnil@gmail.com', '$2b$10$aBcDeFgHiJkLmNoPqRsTuVwXyZ.12345678901234'),
-- ('dirgantara', 'dirgantara@gmail.com', '$2b$10$aBcDeFgHiJkLmNoPqRsTuVwXyZ.12345678901234');

-- SELECT * FROM users;

-- -- Insert sample animes
-- INSERT INTO animes (title, description, image_url, episodes, status, release_year) VALUES
-- ('Attack on Titan', 'Humanity lives inside cities surrounded by enormous walls due to the Titans, gigantic humanoid beings who devour humans seemingly without reason.', 'https://example.com/aot.jpg', 75, 'Completed', 2013),
-- ('Demon Slayer', 'A boy who sells charcoal in Japan discovers his family was slaughtered by a demon.', 'https://example.com/demon-slayer.jpg', 26, 'Ongoing', 2019),
-- ('One Piece', 'Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger.', 'https://example.com/one-piece.jpg', 1000, 'Ongoing', 1999),
-- ('Your Name', 'Two strangers find themselves linked in a bizarre way.', 'https://example.com/your-name.jpg', 1, 'Completed', 2016),
-- ('Jujutsu Kaisen', 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself.', 'https://example.com/jjk.jpg', 24, 'Ongoing', 2020);

-- SELECT * FROM animes;

-- DELETE FROM animes
-- WHERE id > 5;

-- SELECT * FROM users;
-- DELETE FROM users
-- WHERE id = 3;

-- -- Main Anime Table
-- CREATE TABLE anime (
--   id SERIAL PRIMARY KEY,
--   mal_id INTEGER,
--   title TEXT,
--   title_english TEXT,
--   title_japanese TEXT,
--   title_synonyms TEXT,
--   image_url TEXT,
--   type TEXT,
--   source TEXT,
--   episodes INTEGER,
--   status TEXT,
--   premiered TEXT,
--   broadcast TEXT,
--   aired_string TEXT,
--   duration TEXT,
--   rating TEXT,
--   score REAL,
--   scored_by INTEGER,
--   rank INTEGER,
--   popularity INTEGER,
--   members INTEGER,
--   favorites INTEGER,
--   background TEXT
-- );

-- -- Studio
-- CREATE TABLE studio (
--   id SERIAL PRIMARY KEY,
--   name TEXT UNIQUE
-- );

-- -- Studio Anime Join Table
-- CREATE TABLE anime_studio (
--   anime_id INTEGER REFERENCES anime(id),
--   studio_id INTEGER REFERENCES studio(id),
--   PRIMARY KEY (anime_id, studio_id)
-- );

-- -- Genre
-- CREATE TABLE genre (
--   id SERIAL PRIMARY KEY,
--   name TEXT UNIQUE
-- );

-- -- Genre Anime join Table
-- CREATE TABLE anime_genre (
--   anime_id INTEGER REFERENCES anime(id),
--   genre_id INTEGER REFERENCES genre(id),
--   PRIMARY KEY (anime_id, genre_id)
-- );

-- -- Theme
-- CREATE TABLE theme (
--   id SERIAL PRIMARY KEY,
--   anime_id INTEGER REFERENCES anime(id),
--   type TEXT, -- 'opening' or 'ending'
--   theme TEXT
-- );


