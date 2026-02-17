import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { createQuiz, submitScore, getLeaderboard } from "../controllers/quizController.js";

const router = express.Router();

router.post("/create", protectRoute, createQuiz);
router.post("/submit", protectRoute, submitScore);
router.get("/:quizId/leaderboard", protectRoute, getLeaderboard);

export default router;
