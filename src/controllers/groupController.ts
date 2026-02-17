import { Request, Response } from "express";
import { Chat } from "../models/Chat";
import { User } from "../models/User";
import { v4 as uuidv4 } from 'uuid';

export const createGroup = async (req: Request, res: Response) => {
    try {
        const { name, description, groupImage } = req.body;
        const userId = req.auth.userId;

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const inviteCode = uuidv4().substring(0, 8).toUpperCase();

        const group = await Chat.create({
            participants: [user._id],
            isGroup: true,
            name,
            groupImage,
            admin: user._id,
            inviteCode,
            settings: {
                onlyAdminsCanPost: false,
                isQuizActive: false
            }
        });

        res.status(201).json(group);
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: "Failed to create group" });
    }
};

export const joinGroup = async (req: Request, res: Response) => {
    try {
        const { inviteCode } = req.body;
        const userId = req.auth.userId;

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const group = await Chat.findOne({ inviteCode, isGroup: true });
        if (!group) {
            return res.status(404).json({ message: "Invalid invite code" });
        }

        if (group.participants.includes(user._id)) {
            return res.status(400).json({ message: "Already a member of this group" });
        }

        group.participants.push(user._id);
        await group.save();

        res.status(200).json(group);
    } catch (error) {
        console.error("Error joining group:", error);
        res.status(500).json({ message: "Failed to join group" });
    }
};

export const generateInviteCode = async (req: Request, res: Response) => {
    try {
        const { groupId } = req.params;
        const userId = req.auth.userId;

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const group = await Chat.findOne({ _id: groupId, isGroup: true });
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (group.admin?.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Only admin can generate invite code" });
        }

        const newInviteCode = uuidv4().substring(0, 8).toUpperCase();
        group.inviteCode = newInviteCode;
        await group.save();

        res.status(200).json({ inviteCode: newInviteCode });
    } catch (error) {
        console.error("Error generating invite code:", error);
        res.status(500).json({ message: "Failed to generate invite code" });
    }
}
