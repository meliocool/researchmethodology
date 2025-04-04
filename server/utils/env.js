import dotenv from "dotenv";

dotenv.config();

export const DB_HOST = process.env.DB_HOST || "";
export const DB_PORT = process.env.DB_PORT || "";
export const DB_NAME = process.env.DB_NAME || "";
export const DB_USER = process.env.DB_USER || "";
export const DB_PASSWORD = process.env.DB_PASSWORD || "";
export const PORT = process.env.PORT || "";
export const SECRET = process.env.SECRET || "";
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";
export const EMAIL_SMTP_SECURE =
  Boolean(process.env.EMAIL_SMTP_SECURE) || false;
export const EMAIL_SMTP_PASS = process.env.EMAIL_SMTP_PASS || "";
export const EMAIL_SMTP_USER = process.env.EMAIL_SMTP_USER || "";
export const EMAIL_SMTP_PORT = Number(process.env.EMAIL_SMTP_PORT) || 465;
export const EMAIL_SMTP_HOST = process.env.EMAIL_SMTP_HOST || "";
export const EMAIL_SMTP_SERVICE_NAME =
  process.env.EMAIL_SMTP_SERVICE_NAME || "";
export const CLIENT_HOST = process.env.CLIENT_HOST || "";
