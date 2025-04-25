import pool from "../utils/db.js";

export default {
  async findAllAnime(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;
      let query = `
        SELECT 
          a.*,
          COALESCE(ARRAY_AGG(DISTINCT g.name) FILTER (WHERE g.name IS NOT NULL), '{}') AS genres
        FROM anime a
        LEFT JOIN anime_genres ag ON a.anime_id = ag.anime_id
        LEFT JOIN genres g ON ag.genre_id = g.id
        WHERE 1=1
      `;
      const values = [];

      if (search) {
        values.push(`%${search}%`);
        query += `
          AND (
            a.title ILIKE $${values.length}
            OR a.title_english ILIKE $${values.length}
            OR a.title_japanese ILIKE $${values.length}
            OR a.title_synonyms ILIKE $${values.length}
          )
        `;
      }
      query += `
        GROUP BY a.id
        ORDER BY a.id
        LIMIT $${values.length + 1} OFFSET $${values.length + 2}
      `;
      values.push(limit, offset);

      const result = await pool.query(query, values);
      res.status(200).json({
        status: "success",
        page: Number(page),
        limit: Number(limit),
        data: result.rows,
      });
    } catch (err) {
      console.error("Error fetching all anime:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async findByGenre(req, res) {
    try {
      const { genre } = req.params;

      if (!genre) {
        return res.status(400).json({ error: "Genre parameter is required" });
      }

      const query = `
        SELECT 
          a.*,
          COALESCE(ARRAY_AGG(DISTINCT g.name) FILTER (WHERE g.name IS NOT NULL), '{}') AS genres
        FROM anime a
        JOIN anime_genres ag ON a.anime_id = ag.anime_id
        JOIN genres g ON ag.genre_id = g.id
        WHERE a.anime_id IN (
          SELECT a.anime_id
          FROM anime a
          JOIN anime_genres ag ON a.anime_id = ag.anime_id
          JOIN genres g ON ag.genre_id = g.id
          WHERE g.name ILIKE $1
        )
        GROUP BY a.id
      `;

      const result = await pool.query(query, [`%${genre}%`]);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "No anime found for the given genre" });
      }

      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Error fetching by genre:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async findByStudio(req, res) {
    try {
      const { studio } = req.params;
      const query = `
        SELECT a.*, s.name AS studio
        FROM anime a
        JOIN anime_studios ast ON a.anime_id = ast.anime_id
        JOIN studios s ON ast.studio_id = s.id
        WHERE s.name ILIKE $1
      `;
      const result = await pool.query(query, [studio]);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Error fetching by studio:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async findByPremieredYear(req, res) {
    try {
      const { year } = req.params;
      if (!year || isNaN(year)) {
        return res.status(400).json({ error: "Valid Year is Required" });
      }
      const query = `
        SELECT *
        FROM anime
        WHERE RIGHT(premiered, 4) = $1
      `;
      const result = await pool.query(query, [year]);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Error fetching by premiered year:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async findByTitle(req, res) {
    try {
      const { title } = req.params;
      const query = `
        SELECT *
        FROM anime
        WHERE title ILIKE $1
          OR title_english ILIKE $1
          OR title_japanese ILIKE $1
          OR $1 = ANY(title_synonyms)
      `;
      const result = await pool.query(query, [`%${title}%`]);
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "No anime found with the given title" });
      }
      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Error fetching by title:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
