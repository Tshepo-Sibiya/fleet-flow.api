import { Document, Schema as MongooseSchema } from 'mongoose';
export type CheckInRateDocument = CheckInRate & Document;
export declare class CheckInRate {
    driverId: string;
    ownerId: string;
    weeklyAmount: number;
    effectiveWeekStart: string;
}
export declare const CheckInRateSchema: MongooseSchema<CheckInRate, import("mongoose").Model<CheckInRate, any, any, any, Document<unknown, any, CheckInRate, any, {}> & CheckInRate & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CheckInRate, Document<unknown, {}, import("mongoose").FlatRecord<CheckInRate>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<CheckInRate> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
