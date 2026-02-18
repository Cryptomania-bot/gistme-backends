import mongoose, { type Document } from "mongoose";
export interface IMessage extends Document {
    chat: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    text?: string;
    mediaUrl?: string;
    type: 'text' | 'image' | 'video' | 'quiz';
    createdAt: Date;
    updatedAt: Date;
    quiz?: mongoose.Types.ObjectId;
}
export declare const Message: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}, mongoose.DefaultSchemaOptions> & IMessage & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, mongoose.Schema<IMessage, mongoose.Model<IMessage, any, any, any, mongoose.Document<unknown, any, IMessage, any, {}> & IMessage & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IMessage, mongoose.Document<unknown, {}, mongoose.FlatRecord<IMessage>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<IMessage> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>>;
//# sourceMappingURL=message.d.ts.map