import mongoose, { Schema, Document } from "mongoose";
const quizSchema = new Schema({
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
export const Quiz = mongoose.model("Quiz", quizSchema);
//# sourceMappingURL=Quiz.js.map