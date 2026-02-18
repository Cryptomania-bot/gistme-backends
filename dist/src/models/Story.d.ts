import mongoose, { Document } from "mongoose";
export interface IStory extends Document {
    user: mongoose.Types.ObjectId;
    mediaUrl: string;
    type: 'image' | 'video';
    text?: string;
    viewers: mongoose.Types.ObjectId[];
    expiresAt: Date;
    createdAt: Date;
}
export declare const Story: mongoose.Model<IStory, {}, {}, {}, mongoose.Document<unknown, {}, IStory, {}, {}> & IStory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Story.d.ts.map