import fs from "fs";
import { parse } from "csv-parse";
import pool from "../utils/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: Insert or fetch ID
async function upsertAndGetId(table, name) {
  if (!name || name.trim() === "") return null;
  const result = await pool.query(
    `INSERT INTO ${table} (name) VALUES ($1)
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [name.trim()]
  );
  return result.rows[0].id;
}

function sanitizeThatMofo(value) {
  if (value === null || value === undefined || value === "" || value === "[]") {
    return null;
  }
  if (Array.isArray(value) && value.length === 0) {
    return null;
  }
  return value;
}

// Helper: Many-to-many insert
async function insertManyToMany(joinTable, animeId, values, refTable) {
  if (!values) return;
  const items = values
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  for (const value of items) {
    const refId = await upsertAndGetId(refTable, value);
    if (refId) {
      await pool.query(
        `INSERT INTO ${joinTable} (anime_id, ${refTable.slice(0, -1)}_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [animeId, refId]
      );
    }
  }
}

// Parse themes array like "['theme1', 'theme2']"
function parseThemes(themeStr) {
  if (!themeStr) return [];
  return themeStr
    .replace(/^\[|\]$/g, "")
    .split(/',\s*'/)
    .map((s) => s.replace(/^['"]|['"]$/g, "").trim())
    .filter(Boolean);
}

function safeParseJSON(str, animeId, fallback = {}) {
  try {
    if (!str || typeof str !== "string") return fallback;

    // Replace single quotes with double quotes (if needed)
    if (str.includes("'")) {
      str = str.replace(/'/g, '"');
    }

    // Replace Python-style None with JSON null
    str = str.replace(/\bNone\b/g, "null");

    return JSON.parse(str);
  } catch (e) {
    console.warn(
      `⚠️ Failed to parse 'aired' JSON for anime_id ${animeId}:`,
      str
    );
    return fallback;
  }
}

// Insert a single anime row
async function insertAnime(row) {
  const {
    anime_id,
    title,
    title_english,
    title_japanese,
    title_synonyms,
    image_url,
    type,
    source,
    episodes,
    status,
    airing,
    aired_string,
    aired,
    duration,
    rating,
    score,
    scored_by,
    rank,
    popularity,
    members,
    favorites,
    background,
    premiered,
    broadcast,
    producer,
    licensor,
    studio,
    genre,
    opening_theme,
    ending_theme,
  } = row;

  const airedParsed = safeParseJSON(aired, anime_id);

  const result = await pool.query(
    `
        INSERT INTO anime (
          anime_id, title, title_english, title_japanese, title_synonyms,
          image_url, type, source, episodes, status, airing, aired_string,
          aired, duration, rating, score, scored_by, rank, popularity,
          members, favorites, background, premiered, broadcast
        ) VALUES (
          $1, $2, $3, $4, string_to_array($5, ','),
          $6, $7, $8, $9, $10, $11, $12,
          $13, $14, $15, $16, $17, $18, $19,
          $20, $21, $22, $23, $24
        ) ON CONFLICT (anime_id) DO NOTHING
        RETURNING anime_id
      `,
    [
      sanitizeThatMofo(anime_id),
      sanitizeThatMofo(title),
      sanitizeThatMofo(title_english),
      sanitizeThatMofo(title_japanese),
      sanitizeThatMofo(title_synonyms),
      sanitizeThatMofo(image_url),
      sanitizeThatMofo(type),
      sanitizeThatMofo(source),
      sanitizeThatMofo(episodes),
      sanitizeThatMofo(status),
      airing === "True",
      sanitizeThatMofo(aired_string),
      sanitizeThatMofo(airedParsed),
      sanitizeThatMofo(duration),
      sanitizeThatMofo(rating),
      sanitizeThatMofo(score),
      sanitizeThatMofo(scored_by),
      sanitizeThatMofo(rank),
      sanitizeThatMofo(popularity),
      sanitizeThatMofo(members),
      sanitizeThatMofo(favorites),
      sanitizeThatMofo(background),
      sanitizeThatMofo(premiered),
      sanitizeThatMofo(broadcast),
    ]
  );

  if (result.rows.length === 0) return;

  // Join tables
  await insertManyToMany(
    "anime_studios",
    anime_id,
    sanitizeThatMofo(studio),
    "studios"
  );
  await insertManyToMany(
    "anime_producers",
    anime_id,
    sanitizeThatMofo(producer),
    "producers"
  );
  await insertManyToMany(
    "anime_licensors",
    anime_id,
    sanitizeThatMofo(licensor),
    "licensors"
  );
  await insertManyToMany(
    "anime_genres",
    anime_id,
    sanitizeThatMofo(genre),
    "genres"
  );

  for (const theme of parseThemes(sanitizeThatMofo(opening_theme))) {
    await pool.query(
      `INSERT INTO opening_themes (anime_id, theme) VALUES ($1, $2)`,
      [anime_id, theme]
    );
  }

  for (const theme of parseThemes(sanitizeThatMofo(ending_theme))) {
    await pool.query(
      `INSERT INTO ending_themes (anime_id, theme) VALUES ($1, $2)`,
      [anime_id, theme]
    );
  }
}

// Entry point
async function main() {
  const filePath = path.join(__dirname, "../../data/AnimeList.csv");
  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({ columns: true, skip_empty_lines: true }));

  for await (const row of parser) {
    try {
      await insertAnime(row);
      console.log(`Progressing...`);
    } catch (err) {
      console.error(`Error on anime_id ${row.anime_id}: ${err.message}`);
    }
  }
  console.log("Finished!");
  await pool.end();
}

main();
