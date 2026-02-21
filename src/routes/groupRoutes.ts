import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { createGroup, joinGroup, generateInviteCode, updateGroupSettings, leaveGroup, removeMember, updateGroup } from "../controllers/groupController.js";

const router = express.Router();

router.post("/", protectRoute, createGroup);
router.post("/join", protectRoute, joinGroup);
router.post("/:groupId/invite", protectRoute, generateInviteCode);
router.put("/:groupId/settings", protectRoute, updateGroupSettings);
router.delete("/:groupId/leave", protectRoute, leaveGroup);
router.delete("/:groupId/members/:memberId", protectRoute, removeMember);
router.put("/:groupId", protectRoute, updateGroup);

export default router;
