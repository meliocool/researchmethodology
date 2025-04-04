import jwt from "jsonwebtoken";
import { SECRET } from "./env.js";

export const generateToken = (user) => {
  const token = jwt.sign(user, SECRET, {
    expiresIn: "1h",
  });
  return token;
};

export const getUserData = (token) => {
  const user = jwt.verify(token, SECRET);
  return user;
};
