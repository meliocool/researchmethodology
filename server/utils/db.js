import { Pool } from "pg";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from "./env";

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: 5432,
});

export default pool;
