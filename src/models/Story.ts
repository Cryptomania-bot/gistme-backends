import mongoose, { Schema, Document } from "mongoose";

export interface IStory extends Document {
    user: mongoose.Types.ObjectId;
    mediaUrl: string;
    type: 'image' | 'video';
    text?: string;
    viewers: mongoose.Types.ObjectId[];
    expiresAt: Date;
    createdAt: Date;
}

const storySchema = new Schema<IStory>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mediaUrl: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    text: { type: String },
    viewers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

// Auto-delete stories after expiration
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Story = mongoose.model<IStory>("Story", storySchema);
