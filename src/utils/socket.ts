import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { Message } from "../models/message.js";
import { Chat } from "../models/Chat.js";
import { User } from "../models/User.js";


//store online users in memory: userId
export const onlineUsers: Map<string, string> = new Map()

let io: SocketServer;


export const initializeSocket = (httpServer: HttpServer) => {
    const allowedOrigins = [
        "http://localhost:8081",//Expo mobile

        "http://localhost:5173",//vite web dev
        process.env.FRONTEND_URL as string,//production


    ]
    io = new SocketServer(httpServer, { cors: { origin: allowedOrigins } });

    //verify socket

    io.use(async (socket, next) => {


        const token = socket.handshake.auth.token ///what user will send

        if (!token) return next(new Error("Authentication error"));
        try {
            const session = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY!
            });

            const clerkId = session.sub
            const user = await User.findOne({ clerkId });

            if (!user) return next(new Error("User not found"));
            socket.data.userId = user._id.toString()

            next()
        } catch (error: any) {
            next(new Error(error))


        }
    }
    );

    io.on("connection", (socket) => {

        const userId = socket.data.userId

        // send list of online user

        socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });

        onlineUsers.set(userId, socket.id);
        // notify userd

        socket.broadcast.emit("user-online", { userId });
        socket.join(`user:${userId}`);
        socket.on("join-chat", (chatId: string) => {
            socket.join(`chat:${chatId}`)
        });
        //leave chat
        socket.on("leave-chat", (chatId: string) => {
            socket.leave(`chat:${chatId}`)
        });

        //listen incoming message

        socket.on('send-messages', async (data: { chatId: string, text: string }) => {

            try {
                const { chatId, text } = data

                const chat = await Chat.findOne({
                    _id: chatId
                    ,
                    participants: userId
                })

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
                });

                chat.lastMessage = message._id;
                chat.lastMessageAt = new Date()
                await chat.save()

                await message.populate("sender", "name avatar")

                io.to(`chat:${chatId}`).emit("new-messages", message)

                for (const participantId of chat.participants) {
                    io.to(`user:${participantId}`).emit("new-messages", message);
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

        // Quiz Events
        socket.on("create-quiz", (data: { groupId: string, quizId: string, title: string }) => {
            io.to(`chat:${data.groupId}`).emit("quiz-started", {
                quizId: data.quizId,
                title: data.title,
                createdBy: userId // or fetch name
            });
        });

        // WebRTC Signaling
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
            onlineUsers.delete(userId);
            socket.broadcast.emit("user-offline", { userId });
        });
    })

});

return io
}

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
}