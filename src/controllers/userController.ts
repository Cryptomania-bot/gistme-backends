import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { User } from "../models/User.js";

export async function getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const { search } = req.query;

        let query: any = { _id: { $ne: userId } };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query).select("name email avatar").limit(50);
        res.json(users);
    } catch (error) {
        res.status(500);
        next(error);
    }
}
