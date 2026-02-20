import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { createGroup, joinGroup, generateInviteCode, updateGroupSettings } from "../controllers/groupController.js";

const router = express.Router();

router.post("/", protectRoute, createGroup);
router.post("/join", protectRoute, joinGroup);
router.post("/:groupId/invite", protectRoute, generateInviteCode);
router.put("/:groupId/settings", protectRoute, updateGroupSettings);

export default router;
