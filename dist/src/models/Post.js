import mongoose, { Schema, Document } from "mongoose";
const postSchema = new Schema({
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
export const Post = mongoose.model("Post", postSchema);
//# sourceMappingURL=Post.js.map