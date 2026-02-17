import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { Chat } from "../models/Chat.js";
import mongoose from "mongoose";



export async function getChats(req: AuthRequest, res: Response, next: NextFunction) {

    try {
        const userId = req.userId;
        const chats = await Chat.find({ participants: userId }).populate(
            "participants",
            "name email avatar"
        ).populate("lastMessage").sort({ lastMessageAt: -1 })


        const formattedChats = chats.map(chat => {
            if (chat.isGroup) {
                return {
                    _id: chat._id,
                    isGroup: true,
                    name: chat.name,
                    groupImage: chat.groupImage,
                    lastMessage: chat.lastMessage,
                    lastMessageAt: chat.lastMessageAt,
                    createdAt: chat.createdAt,
                    admin: chat.admin,
                    participants: chat.participants, // Return all participants for groups
                    settings: chat.settings
                };
            }

            const otherParticipant = chat.participants.find(p => p._id.toString() !== userId);
            return {
                _id: chat._id,
                participant: otherParticipant ?? null,
                lastMessage: chat.lastMessage,
                lastMessageAt: chat.lastMessageAt,
                createdAt: chat.createdAt,
                isGroup: false
            }

        });
        res.json(formattedChats);
    }
    catch (error) {
        res.status(500);
        next(error);

    }
}


export async function getOrCreateChat(req: AuthRequest, res: Response, next: NextFunction) {

    try {
        const userId = req.userId;
        const { participantId } = req.params;

        if (!participantId) {
            res.status(400).json({ message: "Participant ID is required" })
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(participantId as string)) {
            res.status(400).json({ message: "Invalid participant ID" })
            return;
        }

        if (userId === participantId) {
            res.status(400).json({ message: "You cannot start a chat with yourself" })
            return;
        }


        //check if chat already exist

        let chat = await Chat.findOne({
            participants: { $all: [userId, participantId] },
        }).populate("participants", "name email avatar").populate("lastMessage");


        if (!chat) {
            const newChat = new Chat({ participants: [userId, participantId] });
            await newChat.save();

            chat = await newChat.populate("participants", "name email avatar");


        }

        const otherParticipant = chat.participants.find((p: any) => p._id.toString() !== userId);
        res.json({ _id: chat._id, participant: otherParticipant ?? null, lastMessage: chat.lastMessage, lastMessageAt: chat.lastMessageAt, createdAt: chat.createdAt })





    } catch (error) {
        res.status(500);
        next(error);

    }
}