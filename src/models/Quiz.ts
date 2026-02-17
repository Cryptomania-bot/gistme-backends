import mongoose, { Schema, Document } from "mongoose";

export interface IQuiz extends Document {
    group: mongoose.Types.ObjectId;
    title: string;
    isActive: boolean;
    createdBy: mongoose.Types.ObjectId;
    questions: {
        question: string;
        options: string[];
        correctOptionIndex: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const quizSchema = new Schema<IQuiz>({
    group: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    title: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    questions: [{
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOptionIndex: { type: Number, required: true }
    }]
}, { timestamps: true });

export const Quiz = mongoose.model<IQuiz>("Quiz", quizSchema);
