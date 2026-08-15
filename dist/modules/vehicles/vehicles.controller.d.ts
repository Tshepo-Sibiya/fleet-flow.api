import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto, LinkDriverDto } from './dto/vehicle.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(req: any, dto: CreateVehicleDto): Promise<any>;
    findAll(req: any): Promise<any[]>;
    getMyVehicle(req: any): Promise<any>;
    findOne(req: any, id: string): Promise<any>;
    update(req: any, id: string, dto: UpdateVehicleDto): Promise<any>;
    linkDriver(req: any, id: string, dto: LinkDriverDto): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/vehicle.schema").VehicleDocument, {}, {}> & import("../../schemas/vehicle.schema").Vehicle & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
