import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from '../../schemas/vehicle.schema';
import { UserDocument } from '../../schemas/user.schema';
import { CreateVehicleDto, UpdateVehicleDto, LinkDriverDto } from './dto/vehicle.dto';
export declare class VehiclesService {
    private vehicleModel;
    private userModel;
    constructor(vehicleModel: Model<VehicleDocument>, userModel: Model<UserDocument>);
    create(ownerId: string, dto: CreateVehicleDto): Promise<any>;
    findAllForOwner(ownerId: string): Promise<any[]>;
    findOneForDriver(driverId: string): Promise<any>;
    findOne(id: string, ownerId: string): Promise<any>;
    update(id: string, ownerId: string, dto: UpdateVehicleDto): Promise<any>;
    linkDriver(id: string, ownerId: string, dto: LinkDriverDto): Promise<import("mongoose").Document<unknown, {}, VehicleDocument, {}, {}> & Vehicle & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string, ownerId: string): Promise<{
        message: string;
    }>;
    private enrichVehicle;
}
