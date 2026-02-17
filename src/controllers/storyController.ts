import type { AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";
import { Story } from "../models/Story.js";
import { User } from "../models/User.js";

// Create a new story
export const createStory = async (req: AuthRequest, res: Response) => {
    try {
        const { mediaUrl, type, text } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Expires in 24 hours

        const story = await Story.create({
            user: userId,
            mediaUrl,
            type,
            text,
            expiresAt
        });

        res.status(201).json(story);
    } catch (error) {
        console.error("Error creating story:", error);
        res.status(500).json({ message: "Failed to create story" });
    }
};

// Get active stories (from self and others)
// In a real app, this would filter by friends/contacts. For now, it returns all active stories.
export const getActiveStories = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const stories = await Story.find({
            expiresAt: { $gt: new Date() } // Only active stories
        })
            .sort({ createdAt: -1 })
            .populate("user", "name avatar");

        res.status(200).json(stories);
    } catch (error) {
        console.error("Error fetching stories:", error);
        res.status(500).json({ message: "Failed to fetch stories" });
    }
};
