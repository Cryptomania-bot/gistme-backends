import type { AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";
import { Call } from "../models/Call.js";
import { User } from "../models/User.js";

// Log a new call
export const logCall = async (req: AuthRequest, res: Response) => {
    try {
        const { receiverId, type, status, duration } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const call = await Call.create({
            caller: userId,
            receiver: receiverId,
            type,
            status,
            duration: duration || 0,
            endedAt: status === 'completed' ? new Date() : undefined
        });

        res.status(201).json(call);
    } catch (error) {
        console.error("Error logging call:", error);
        res.status(500).json({ message: "Failed to log call" });
    }
};

// Get recent calls
export const getRecentCalls = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const calls = await Call.find({
            $or: [{ caller: userId }, { receiver: userId }]
        })
            .sort({ startedAt: -1 })
            .limit(50)
            .populate("caller", "name avatar")
            .populate("receiver", "name avatar");

        res.status(200).json(calls);
    } catch (error) {
        console.error("Error fetching calls:", error);
        res.status(500).json({ message: "Failed to fetch calls" });
    }
};
