import nodemailer from "nodemailer";
import {
  EMAIL_SMTP_SECURE,
  EMAIL_SMTP_PASS,
  EMAIL_SMTP_USER,
  EMAIL_SMTP_PORT,
  EMAIL_SMTP_HOST,
  EMAIL_SMTP_SERVICE_NAME,
} from "../env.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

// Konfigurasi nodemailer
const transporter = nodemailer.createTransport({
  service: EMAIL_SMTP_SERVICE_NAME,
  host: EMAIL_SMTP_HOST,
  port: EMAIL_SMTP_PORT,
  secure: EMAIL_SMTP_SECURE,
  auth: {
    user: EMAIL_SMTP_USER,
    pass: EMAIL_SMTP_PASS,
  },
  requireTLS: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to send email
export const sendMail = async ({ ...mailParams }) => {
  const result = await transporter.sendMail({
    ...mailParams,
  });
  return result;
};

// Render ejs file
export const renderMailHtml = async (template, data) => {
  try {
    const content = await ejs.renderFile(
      path.join(__dirname, `templates/${template}`),
      data
    );
    return content;
  } catch (error) {
    console.error("❌ Failed to render EJS template:", err);
    throw err;
  }
};
