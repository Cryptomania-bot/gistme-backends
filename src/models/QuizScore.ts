import mongoose, { Schema, Document } from "mongoose";

export interface IQuizScore extends Document {
    user: mongoose.Types.ObjectId;
    quiz: mongoose.Types.ObjectId;
    score: number;
    completedAt: Date;
}

const quizScoreSchema = new Schema<IQuizScore>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    score: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure a user can only have one score per quiz
quizScoreSchema.index({ user: 1, quiz: 1 }, { unique: true });

export const QuizScore = mongoose.model<IQuizScore>("QuizScore", quizScoreSchema);
