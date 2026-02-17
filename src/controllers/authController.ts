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
        console.log(`[AuthSync] Triggered for Clerk ID: ${clerkId}`);

        if (!clerkId) {
            console.error("[AuthSync] Failed: No clerkId found in request headers/token");
            return res.status(401).json({ message: 'Unauthorized - Invalid Clerk token' });
        }

        let user = await User.findOne({ clerkId });

        if (!user) {
            console.log(`[AuthSync] User ${clerkId} not found in DB. Fetching from Clerk...`);
            try {
                const clerkUser = await clerkClient.users.getUser(clerkId);
                console.log(`[AuthSync] Clerk data received for ${clerkId}:`, {
                    hasEmail: clerkUser.emailAddresses.length > 0,
                    firstName: clerkUser.firstName,
                    lastName: clerkUser.lastName
                });

                // Ensure a unique email even if none provided by Clerk
                const email = clerkUser.emailAddresses[0]?.emailAddress ||
                    `${clerkId}@gistme.clerk.user`;

                // Build name with fallbacks
                let name = "Unnamed User";
                if (clerkUser.firstName) {
                    name = `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim();
                } else if (clerkUser.emailAddresses[0]?.emailAddress) {
                    name = clerkUser.emailAddresses[0].emailAddress.split('@')[0] || "Unnamed User";
                }

                console.log(`[AuthSync] Creating user with email: ${email}, name: ${name}, clerkId: ${clerkUser.id}`);

                user = await User.create({
                    clerkId: clerkUser.id,
                    email: email,
                    name: name,
                    avatar: (clerkUser.imageUrl || ''),
                });

                console.log(`[AuthSync] Success! User recorded with DB ID: ${user._id}`);
            } catch (clerkError: any) {
                console.error(`[AuthSync] Clerk API Error for ${clerkId}:`, clerkError.message);
                return res.status(500).json({ message: "Failed to fetch user data from Clerk", error: clerkError.message });
            }
        } else {
            console.log(`[AuthSync] User ${clerkId} already exists in DB as ${user._id}`);
        }

        res.json(user);
    }
    catch (error: any) {
        console.error("[AuthSync] Global Error:", error.message, error.stack);
        // Explicitly check for MongoDB duplicate key error (11000)
        if (error.code === 11000) {
            return res.status(409).json({ message: "User or Email already exists", details: error.keyValue });
        }
        next(error);
    }
}