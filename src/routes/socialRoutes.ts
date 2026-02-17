import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { logCall, getRecentCalls } from "../controllers/callController.js";
import { createStory, getActiveStories } from "../controllers/storyController.js";

const router = express.Router();

// Call Routes
router.post("/calls", protectRoute, logCall);
router.get("/calls", protectRoute, getRecentCalls);

// Story Routes
router.post("/stories", protectRoute, createStory);
router.get("/stories", protectRoute, getActiveStories);

export default router;
