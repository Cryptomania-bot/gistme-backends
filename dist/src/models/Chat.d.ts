import mongoose, { type Document } from "mongoose";
export interface IChat extends Document {
    participants: mongoose.Types.ObjectId[];
    lastMessage?: mongoose.Types.ObjectId;
    lastMessageAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    isGroup: boolean;
    name?: string;
    groupImage?: string;
    admin?: mongoose.Types.ObjectId;
    inviteCode?: string;
    settings?: {
        onlyAdminsCanPost: boolean;
        isQuizActive: boolean;
    };
}
declare const Chat: mongoose.Model<IChat, {}, {}, {}, mongoose.Document<unknown, {}, IChat, {}, mongoose.DefaultSchemaOptions> & IChat & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, mongoose.Schema<IChat, mongoose.Model<IChat, any, any, any, mongoose.Document<unknown, any, IChat, any, {}> & IChat & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IChat, mongoose.Document<unknown, {}, mongoose.FlatRecord<IChat>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<IChat> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>>;
export { Chat };
//# sourceMappingURL=Chat.d.ts.map