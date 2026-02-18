import { getAuth, requireAuth } from "@clerk/express";
import { User } from "../models/User.js";
export const protectRoute = [
    requireAuth(),
    async (req, res, next) => {
        try {
            const { userId: clerkId } = getAuth(req);
            if (!clerkId) {
                return res.status(401).json({ message: 'Unauthorized- invalid token' });
            }
            const user = await User.findOne({ clerkId });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            req.userId = user._id.toString();
            next();
        }
        catch (error) {
            next(error);
        }
    }
];
//# sourceMappingURL=auth.js.map