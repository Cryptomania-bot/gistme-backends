import mongoose, { Schema, Document } from "mongoose";

export interface IComment {
    user: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
}

export interface IPost extends Document {
    user: mongoose.Types.ObjectId;
    text: string;
    mediaUrl?: string;
    type: 'text' | 'image' | 'video';
    likes: mongoose.Types.ObjectId[];
    dislikes: mongoose.Types.ObjectId[];
    comments: IComment[];
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<IPost>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    mediaUrl: { type: String },
    type: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export const Post = mongoose.model<IPost>("Post", postSchema);
