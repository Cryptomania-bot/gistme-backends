import {Router} from "express";
import {getMe}from "../controllers/authController.js";
import {protectRoute} from "../middleware/auth.js";
import {authCallback} from "../controllers/authController.js";


const router = Router();

//api/auth/me
router.get('/me',protectRoute,getMe);
router.post('/callback',authCallback);



export default router;