import express from "express";
import { protectRoute } from "../middleware/auth.js";
// End quiz
import { createQuiz, submitScore, getLeaderboard, endQuiz } from "../controllers/quizController.js";

const router = express.Router();

router.post("/create", protectRoute, createQuiz);
router.post("/submit", protectRoute, submitScore);
router.post("/end", protectRoute, endQuiz);
router.get("/:quizId/leaderboard", protectRoute, getLeaderboard);

export default router;
