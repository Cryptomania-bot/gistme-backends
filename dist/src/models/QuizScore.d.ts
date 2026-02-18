import mongoose, { Document } from "mongoose";
export interface IQuizScore extends Document {
    user: mongoose.Types.ObjectId;
    quiz: mongoose.Types.ObjectId;
    score: number;
    completedAt: Date;
}
export declare const QuizScore: mongoose.Model<IQuizScore, {}, {}, {}, mongoose.Document<unknown, {}, IQuizScore, {}, {}> & IQuizScore & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=QuizScore.d.ts.map