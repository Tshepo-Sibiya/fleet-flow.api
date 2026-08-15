import { DriversService } from './drivers.service';
import { UserRole } from '../../schemas/user.schema';
export declare class DriversController {
    private readonly driversService;
    constructor(driversService: DriversService);
    createDriver(req: any, body: {
        fullName: string;
        email: string;
        phoneNumber?: string;
        password?: string;
    }): Promise<import("../../schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(req: any): Promise<{
        assignedVehicle: import("mongoose").Document<unknown, {}, import("../../schemas/vehicle.schema").VehicleDocument, {}, {}> & import("../../schemas/vehicle.schema").Vehicle & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findOne(id: string): Promise<{
        assignedVehicle: import("mongoose").Document<unknown, {}, import("../../schemas/vehicle.schema").VehicleDocument, {}, {}> & import("../../schemas/vehicle.schema").Vehicle & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
}
