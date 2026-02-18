import mongoose, { Schema, Document } from "mongoose";
const quizScoreSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    score: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });
// Ensure a user can only have one score per quiz
quizScoreSchema.index({ user: 1, quiz: 1 }, { unique: true });
export const QuizScore = mongoose.model("QuizScore", quizScoreSchema);
//# sourceMappingURL=QuizScore.js.map