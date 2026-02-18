import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { Message } from "../models/message.js";
import { Chat } from "../models/Chat.js";
import { User } from "../models/User.js";


// Store online users: userId -> Set of socketIds
export const onlineUsers: Map<string, Set<string>> = new Map();

let io: SocketServer;

export const initializeSocket = (httpServer: HttpServer) => {
    const allowedOrigins = [
        "https://gistme.netlify.app",
        "http://localhost:8081",
        "http://localhost:5173",
        "http://localhost:3000",
    ];
    io = new SocketServer(httpServer, {
        cors: {
            origin: allowedOrigins,
            credentials: true
        }
    });

    // Verify socket
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("Authentication error"));
        try {
            const session = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY!
            });
            const clerkId = session.sub;
            const user = await User.findOne({ clerkId });
            if (!user) return next(new Error("User not found"));
            socket.data.userId = user._id.toString();
            next();
        } catch (error: any) {
            next(new Error(error));
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.data.userId;

        // Add this socket to user's set
        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
            // First session - broadcast online
            socket.broadcast.emit("user-online", { userId });
        }
        onlineUsers.get(userId)?.add(socket.id);

        // Send current online user list (keys of our map)
        socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });

        socket.join(`user:${userId}`);

        socket.on("join-chat", (chatId: string) => {
            socket.join(`chat:${chatId}`);
        });

        socket.on("leave-chat", (chatId: string) => {
            socket.leave(`chat:${chatId}`);
        });

        socket.on('send-message', async (data: { chatId: string, text?: string, mediaUrl?: string, type?: 'text' | 'image' | 'video' }) => {
            try {
                const { chatId, text, mediaUrl, type = 'text' } = data;
                const chat = await Chat.findOne({
                    _id: chatId,
                    participants: userId
                });
                if (!chat) {
                    socket.emit("socket-error", { message: "Chat not found" });
                    return;
                }
                if (chat.isGroup && chat.settings?.onlyAdminsCanPost) {
                    if (chat.admin?.toString() !== userId) {
                        socket.emit("socket-error", { message: "Only admins can post in this group" });
                        return;
                    }
                }
                const message = await Message.create({
                    chat: chatId,
                    sender: userId,
                    text,
                    mediaUrl,
                    type
                });
                chat.lastMessage = message._id;
                chat.lastMessageAt = new Date();
                await chat.save();
                await message.populate("sender", "name avatar");
                io.to(`chat:${chatId}`).emit("new-message", message);
                for (const participantId of chat.participants) {
                    io.to(`user:${participantId}`).emit("new-message", message);
                }
            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("socket-error", { message: "Failed to send message" });
            }
        });

        socket.on("typing", (data: { chatId: string, isTyping: boolean }) => {
            if (data.isTyping) {
                socket.to(`chat:${data.chatId}`).emit("typing", { userId, chatId: data.chatId });
            } else {
                socket.to(`chat:${data.chatId}`).emit("stop-typing", { userId, chatId: data.chatId });
            }
        });

        socket.on("create-quiz", (data: { groupId: string, quizId: string, title: string }) => {
            io.to(`chat:${data.groupId}`).emit("quiz-started", {
                quizId: data.quizId,
                title: data.title,
                createdBy: userId
            });
        });

        socket.on("call-offer", (data: { callerId: string, receiverId: string, offer: any }) => {
            io.to(`user:${data.receiverId}`).emit("call-offer", {
                callerId: userId,
                offer: data.offer
            });
        });

        socket.on("call-answer", (data: { callerId: string, answer: any }) => {
            io.to(`user:${data.callerId}`).emit("call-answer", {
                receiverId: userId,
                answer: data.answer
            });
        });

        socket.on("ice-candidate", (data: { targetId: string, candidate: any }) => {
            io.to(`user:${data.targetId}`).emit("ice-candidate", {
                senderId: userId,
                candidate: data.candidate
            });
        });

        socket.on("end-call", (data: { targetId: string }) => {
            io.to(`user:${data.targetId}`).emit("call-ended", {
                enderId: userId
            });
        });

        socket.on("disconnect", () => {
            const userSockets = onlineUsers.get(userId);
            if (userSockets) {
                userSockets.delete(socket.id);
                if (userSockets.size === 0) {
                    onlineUsers.delete(userId);
                    socket.broadcast.emit("user-offline", { userId });
                }
            }
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
}