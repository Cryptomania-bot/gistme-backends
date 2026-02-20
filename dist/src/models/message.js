import mongoose, { Schema } from "mongoose";
const messageSchema = new Schema({
    chat: {
        type: Schema.Types.ObjectId,
        ref: "Chat", required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User", required: true
    },
    text: { type: String, trim: true },
    mediaUrl: { type: String },
    type: { type: String, enum: ['text', 'image', 'video', 'quiz'], default: 'text' },
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz" },
    replyTo: { type: Schema.Types.ObjectId, ref: "Message", default: null }
}, { timestamps: true });
messageSchema.index({ chat: 1, createdAt: 1 });
export const Message = mongoose.model("Message", messageSchema);
//# sourceMappingURL=Message.js.map