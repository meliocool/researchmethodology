import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import animeController from "../controllers/anime.controller.js";
import animelistController from "../controllers/animelist.controller.js";

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

// -- ANIME LIST STUFF -- //
router.post("/animelist", authMiddleware, animelistController.addToAnimeList);
router.get("/animelist", authMiddleware, animelistController.getUserAnimeList);
router.put(
  "/animelist/:animeId",
  authMiddleware,
  animelistController.updateAnime
);
router.delete(
  "/animelist/:animeId",
  authMiddleware,
  animelistController.removeFromAnimeList
);

export default router;
