import mongoose, { Document } from "mongoose";
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
export declare const Quiz: mongoose.Model<IQuiz, {}, {}, {}, mongoose.Document<unknown, {}, IQuiz, {}, {}> & IQuiz & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Quiz.d.ts.map