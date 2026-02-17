import type { AuthRequest } from "../middleware/auth.js";
import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { getAuth, clerkClient } from "@clerk/express";



export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }

}

export async function authCallback(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId: clerkId } = getAuth(req);
        console.log("Auth callback triggered for clerkId:", clerkId);

        if (!clerkId) {
            console.error("Auth callback failed: No clerkId found in request");
            return res.status(401).json({ message: 'Unauthorized- invalid token' });
        }

        let user = await User.findOne({ clerkId });
        if (!user) {
            console.log("New user detected, fetching details from Clerk...");
            const clerkUser = await clerkClient.users.getUser(clerkId);

            // Robust email extraction
            const email = clerkUser.emailAddresses[0]?.emailAddress ||
                clerkUser.primaryEmailAddressId ||
                `${clerkId}@clerk.user`;

            user = await User.create({
                clerkId: clerkUser.id,
                email: email,
                name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : clerkUser.emailAddresses[0]?.emailAddress?.split('@')[0] || 'Unnamed User',
                avatar: clerkUser.imageUrl || '',
            });
            console.log("User successfully recorded in database:", user._id);
        } else {
            console.log("Existing user found in database:", user._id);
        }
        res.json(user);
    }
    catch (error) {
        console.error("Error in authCallback:", error);
        next(error)
    }

}