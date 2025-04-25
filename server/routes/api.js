import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import animeController from "../controllers/anime.controller.js";

const router = express.Router();

// -- AUTHENTICATION STUFF -- //
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);
router.post("/auth/activation", authController.activation);

// -- ANIME STUFF -- //
router.get("/anime", animeController.findAllAnime);
router.get("/anime/genre/:genre", animeController.findByGenre);
router.get("/anime/studio/:studio", animeController.findByStudio);
router.get("/anime/year/:year", animeController.findByPremieredYear);
router.get("/anime/title/:title", animeController.findByTitle);

export default router;
