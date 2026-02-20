import mongoose, { Document } from "mongoose";
export interface IComment {
    user: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
}
export interface IPost extends Document {
    user: mongoose.Types.ObjectId;
    text: string;
    mediaUrl?: string;
    type: 'text' | 'image' | 'video';
    likes: mongoose.Types.ObjectId[];
    dislikes: mongoose.Types.ObjectId[];
    comments: IComment[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Post: mongoose.Model<IPost, {}, {}, {}, mongoose.Document<unknown, {}, IPost, {}, {}> & IPost & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Post.d.ts.map