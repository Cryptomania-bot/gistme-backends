import {Router} from "express";
import { protectRoute } from "../middleware/auth.js";
import { getChats, getOrCreateChat } from "../controllers/chatController.js";



const router = Router();
router.get("/",protectRoute,getChats)
router.get("/with/:participantId",protectRoute,getOrCreateChat)



export default router;