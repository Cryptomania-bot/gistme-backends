import mongoose, { Schema, Document } from "mongoose";
const callSchema = new Schema({
    caller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, required: true }, // Can be User or Chat
    type: { type: String, enum: ['audio', 'video'], required: true },
    status: { type: String, enum: ['missed', 'completed', 'declined', 'ongoing'], default: 'ongoing' },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    duration: { type: Number }
}, { timestamps: true });
export const Call = mongoose.model("Call", callSchema);
//# sourceMappingURL=Call.js.map