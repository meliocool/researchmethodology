import pool from "../utils/db.js";
import response from "../utils/response.js";

export default {
  async addToAnimeList(req, res) {
    const { anime_id, user_rating, status, notes } = req.body;
    const user_id = req.user.id;
    const checkQuery = `
        SELECT * FROM anime_lists WHERE user_id = $1 AND anime_id = $2
        `;
    const insertQuery = `
        INSERT INTO anime_lists (user_id, anime_id, user_rating, status, notes) VALUES ($1, $2, $3, $4, $5)
        `;
    try {
      const exists = await pool.query(checkQuery, [user_id, anime_id]);
      if (exists.rows.length > 0) {
        return res
          .status(409)
          .json({ message: `Anime already in YOUR list!!` });
      }
      await pool.query(insertQuery, [
        user_id,
        anime_id,
        user_rating,
        status,
        notes ?? null,
      ]);
      res.status(201).json({ message: "Anime added to your list." });
    } catch (err) {
      console.error("Error adding to anime list:", err);
      res.status(500).json({ error: "Something went wrong!" });
    }
  },
  async getUserAnimeList(req, res) {
    const user_id = req.user.id;
    const query = `
    SELECT 
      al.id, 
      al.user_rating, 
      al.status, 
      al.notes, 
      a.anime_id, 
      a.title, 
      a.title_english, 
      a.title_japanese, 
      a.title_synonyms, 
      a.image_url, 
      a.type, 
      a.source, 
      a.episodes, 
      a.aired_string,
      u.username
    FROM anime_lists al
    LEFT JOIN anime a ON al.anime_id = a.anime_id
    LEFT JOIN users u ON al.user_id = u.id
    WHERE al.user_id = $1
    ORDER BY al.id DESC
  `;
    try {
      const result = await pool.query(query, [user_id]);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "No anime found in the user's list." });
      }
      const username = result.rows[0].username;
      res.json({
        message: `Anime List for User ${username}`,
        data: result.rows,
      });
    } catch (err) {
      console.error("Error fetching user anime list:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  async updateAnime(req, res) {
    const { animeId } = req.params;
    const { user_rating, status, notes } = req.body;
    const user_id = req.user.id;
    try {
      const updates = [];
      const values = [];
      let index = 1;

      if (user_rating !== undefined) {
        updates.push(`user_rating = $${index++}`);
        values.push(user_rating);
      }

      if (status !== undefined) {
        updates.push(`status = $${index++}`);
        values.push(status);
      }

      if (notes !== undefined) {
        updates.push(`notes = $${index++}`);
        values.push(notes);
      }

      if (updates.length === 0) {
        return res.status(400).json({ message: "Empty fields" });
      }

      values.push(user_id, animeId);

      const query = `
          UPDATE anime_lists
          SET ${updates.join(", ")}
          WHERE user_id = $${index++} AND anime_id = $${index}
          RETURNING *;
        `;

      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Anime not found in user list." });
      }
      res.status(200).json({ message: "Update successful!", data: rows[0] });
    } catch (err) {
      console.error("Error updating user anime list:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  async removeFromAnimeList(req, res) {
    const { animeId } = req.params;
    const user_id = req.user.id;
    const query = `DELETE FROM anime_lists WHERE user_id = $1 AND anime_id = $2`;
    try {
      const result = await pool.query(query, [user_id, animeId]);
      if (result.rowCount === 0) {
        return response.notFound(res, "Anime Not Found!");
      }
      res.json({ message: "Anime successfully removed!" });
    } catch (err) {
      console.error("Error removing: ", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
