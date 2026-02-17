import mongoose, { Schema, type Document } from "mongoose";

export interface IChat extends Document {
    participants: mongoose.Types.ObjectId[];
    lastMessage?: mongoose.Types.ObjectId;
    lastMessageAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    isGroup: boolean;
    name?: string;
    groupImage?: string;
    admin?: mongoose.Types.ObjectId;
    inviteCode?: string;
    settings?: {
        onlyAdminsCanPost: boolean;
        isQuizActive: boolean;
    };
}
const chatSchema = new Schema<IChat>({
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message", default: null },
    lastMessageAt: { type: Date, default: Date.now },
    isGroup: { type: Boolean, default: false },
    name: { type: String },
    groupImage: { type: String, default: null },
    admin: { type: Schema.Types.ObjectId, ref: "User" },
    inviteCode: { type: String, unique: true, sparse: true },
    settings: {
        onlyAdminsCanPost: { type: Boolean, default: false },
        isQuizActive: { type: Boolean, default: false },
    }
}, { timestamps: true });


const Chat = mongoose.model("Chat", chatSchema);

export { Chat };