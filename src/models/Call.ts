import mongoose, { Schema, Document } from "mongoose";

export interface ICall extends Document {
    caller: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId; // User or Group ID
    type: 'audio' | 'video';
    status: 'missed' | 'completed' | 'declined' | 'ongoing';
    startedAt: Date;
    endedAt?: Date;
    duration?: number; // seconds
}

const callSchema = new Schema<ICall>({
    caller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, required: true }, // Can be User or Chat
    type: { type: String, enum: ['audio', 'video'], required: true },
    status: { type: String, enum: ['missed', 'completed', 'declined', 'ongoing'], default: 'ongoing' },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    duration: { type: Number }
}, { timestamps: true });

export const Call = mongoose.model<ICall>("Call", callSchema);
