import express from "express";
import { protectRoute } from "../middleware/auth.js";
// End quiz
import { createQuiz, submitScore, getLeaderboard, endQuiz, getQuizById, getGroupQuizzes, generateQuizWithAI } from "../controllers/quizController.js";

const router = express.Router();

router.post("/create", protectRoute, createQuiz);
router.post("/submit", protectRoute, submitScore);
router.post("/end", protectRoute, endQuiz);
router.get("/group/:groupId", protectRoute, getGroupQuizzes);
router.get("/:quizId/leaderboard", protectRoute, getLeaderboard);
router.get("/:quizId", protectRoute, getQuizById);
router.post("/generate", protectRoute, generateQuizWithAI);

export default router;
