import { Document, Schema as MongooseSchema } from 'mongoose';
export type VehicleDocument = Vehicle & Document;
export declare class Vehicle {
    make: string;
    model: string;
    year: number;
    registrationNumber: string;
    color: string;
    currentMileage: number;
    nextServiceMileage: number;
    ownerId: string;
    assignedDriverId?: string;
}
export declare const VehicleSchema: MongooseSchema<Vehicle, import("mongoose").Model<Vehicle, any, any, any, Document<unknown, any, Vehicle, any, {}> & Vehicle & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Vehicle, Document<unknown, {}, import("mongoose").FlatRecord<Vehicle>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Vehicle> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
