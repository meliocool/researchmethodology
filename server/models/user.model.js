// models/user.model.js
import pool from "../utils/db.js";
import { encrypt } from "../utils/encryption.js";
import { renderMailHtml, sendMail } from "../utils/mail/mail.js";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env.js";

// CREATE
const create = async ({ fullName, username, email, password }) => {
  const passwordHash = encrypt(password);
  const activationCode = encrypt(username); // you can use uuid instead if needed

  const query = `
    INSERT INTO users (full_name, username, email, password_hash, activation_code)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [fullName, username, email, passwordHash, activationCode];
  const { rows } = await pool.query(query, values);
  const user = rows[0];

  try {
    const contentMail = await renderMailHtml("registration-success.ejs", {
      username: user.username,
      fullName: user.full_name,
      email: user.email,
      createdAt: user.created_at,
      activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activation_code}`,
    });

    await sendMail({
      from: EMAIL_SMTP_USER,
      to: user.email,
      subject: "Dirgantara Anime Account Activation",
      html: contentMail,
    });
  } catch (mailErr) {
    console.error("❌ Failed to send mail:", mailErr.message);
  }

  return user;
};

// FIND ONE BY EMAIL OR USERNAME
const findOne = async ({ identifier }) => {
  const query = `
    SELECT * FROM users
    WHERE (email = $1 OR username = $1)
    LIMIT 1;
  `;
  const { rows } = await pool.query(query, [identifier]);
  return rows[0];
};

// FIND BY ID
const findById = async (id) => {
  const query = `SELECT * FROM users WHERE id = $1 LIMIT 1;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

// ACTIVATE USER
const activateUser = async (code) => {
  const query = `
    UPDATE users SET is_active = true
    WHERE activation_code = $1
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [code]);
  return rows[0];
};

export default {
  create,
  findOne,
  findById,
  activateUser,
};
