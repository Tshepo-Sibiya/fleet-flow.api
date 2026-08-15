import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';
import { Vehicle, VehicleDocument } from '../../schemas/vehicle.schema';
import { WeeklySettlementDocument } from '../../schemas/weekly-settlement.schema';
import { AdvanceRequestDocument } from '../../schemas/advance-request.schema';
import { CheckInRateDocument } from '../../schemas/check-in-rate.schema';
export declare class DriversService {
    private userModel;
    private vehicleModel;
    private settlementModel;
    private advanceModel;
    private checkInRateModel;
    constructor(userModel: Model<UserDocument>, vehicleModel: Model<VehicleDocument>, settlementModel: Model<WeeklySettlementDocument>, advanceModel: Model<AdvanceRequestDocument>, checkInRateModel: Model<CheckInRateDocument>);
    createDriver(ownerId: string, data: {
        fullName: string;
        email: string;
        phoneNumber?: string;
        password?: string;
    }): Promise<User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAllForOwner(ownerId: string): Promise<{
        assignedVehicle: import("mongoose").Document<unknown, {}, VehicleDocument, {}, {}> & Vehicle & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        currentDebtBalance: number;
        weeklyCheckInAmount: number;
        email: string;
        password: string;
        fullName: string;
        phoneNumber: string;
        role: UserRole;
        ownerId?: string;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }[]>;
    getDriverDetails(driverId: string): Promise<{
        assignedVehicle: import("mongoose").Document<unknown, {}, VehicleDocument, {}, {}> & Vehicle & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        currentDebtBalance: number;
        weeklyCheckInAmount: number;
        email: string;
        password: string;
        fullName: string;
        phoneNumber: string;
        role: UserRole;
        ownerId?: string;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    getDriverCurrentDebt(driverId: string): Promise<number>;
    getDriverCurrentCheckInRate(driverId: string): Promise<number>;
    private getMondayString;
}
