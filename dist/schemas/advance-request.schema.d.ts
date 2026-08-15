import { Document, Schema as MongooseSchema } from 'mongoose';
export type AdvanceRequestDocument = AdvanceRequest & Document;
export declare enum AdvanceStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare class AdvanceRequest {
    driverId: string;
    ownerId: string;
    amount: number;
    reason: string;
    status: AdvanceStatus;
    reviewedAt?: Date;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const AdvanceRequestSchema: MongooseSchema<AdvanceRequest, import("mongoose").Model<AdvanceRequest, any, any, any, Document<unknown, any, AdvanceRequest, any, {}> & AdvanceRequest & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AdvanceRequest, Document<unknown, {}, import("mongoose").FlatRecord<AdvanceRequest>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<AdvanceRequest> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
