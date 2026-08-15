import { Document, Schema as MongooseSchema } from 'mongoose';
export type WeeklySettlementDocument = WeeklySettlement & Document;
export declare class WeeklySettlement {
    driverId: string;
    ownerId: string;
    vehicleId?: string;
    weekStartDate: string;
    weekEndDate: string;
    uberGrossPayout: number;
    fixedCheckInAmount: number;
    openingDebtBalance: number;
    approvedAdvancesThisWeek: number;
    totalDebtOwed: number;
    requestedDebtDeduction: number;
    actualDebtDeducted: number;
    netDriverPayout: number;
    closingDebtBalance: number;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const WeeklySettlementSchema: MongooseSchema<WeeklySettlement, import("mongoose").Model<WeeklySettlement, any, any, any, Document<unknown, any, WeeklySettlement, any, {}> & WeeklySettlement & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WeeklySettlement, Document<unknown, {}, import("mongoose").FlatRecord<WeeklySettlement>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<WeeklySettlement> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
