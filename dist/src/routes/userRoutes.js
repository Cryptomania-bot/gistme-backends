import { Router } from "express";
import { protectRoute } from "../middleware/auth.js";
import { getUsers, updateMe } from "../controllers/userController.js";
const router = Router();
router.get("/", protectRoute, getUsers);
router.put("/me", protectRoute, updateMe);
export default router;
//# sourceMappingURL=userRoutes.js.map