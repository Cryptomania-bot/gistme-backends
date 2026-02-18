import mongoose, { Document } from "mongoose";
export interface ICall extends Document {
    caller: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    type: 'audio' | 'video';
    status: 'missed' | 'completed' | 'declined' | 'ongoing';
    startedAt: Date;
    endedAt?: Date;
    duration?: number;
}
export declare const Call: mongoose.Model<ICall, {}, {}, {}, mongoose.Document<unknown, {}, ICall, {}, {}> & ICall & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Call.d.ts.map