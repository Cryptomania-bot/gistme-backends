import { Message } from "../models/Message.js";
import { Chat } from "../models/Chat.js";
export async function getMessages(req, res, next) {
    try {
        const userId = req.userId;
        const { chatId } = req.params;
        const chat = await Chat.findOne({ _id: chatId, participants: userId });
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        const messages = await Message.find({ chat: chatId })
            .populate("sender", "name email avatar")
            .populate("quiz", "title createdBy")
            .populate("replyTo", "text mediaUrl sender type")
            .sort({ createdAt: 1 });
        res.json(messages);
    }
    catch (error) {
        res.status(500);
        next(error);
    }
}
//# sourceMappingURL=messageController.js.map