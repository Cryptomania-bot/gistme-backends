import { Router } from "express";
import { protectRoute } from "../middleware/auth.js";
import { getChats, getOrCreateChat, getChatById } from "../controllers/chatController.js";
const router = Router();
router.get("/", protectRoute, getChats);
router.post("/with/:participantId", protectRoute, getOrCreateChat);
router.get("/:chatId", protectRoute, getChatById);
export default router;
//# sourceMappingURL=chatRoutes.js.map