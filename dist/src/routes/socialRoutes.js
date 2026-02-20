import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { createPost, getPosts, toggleLike, toggleDislike, addComment } from "../controllers/postController.js";
const router = express.Router();
// Post Routes
router.post("/posts", protectRoute, createPost);
router.get("/posts", protectRoute, getPosts);
router.post("/posts/:id/like", protectRoute, toggleLike);
router.post("/posts/:id/dislike", protectRoute, toggleDislike);
router.post("/posts/:id/comment", protectRoute, addComment);
export default router;
//# sourceMappingURL=socialRoutes.js.map