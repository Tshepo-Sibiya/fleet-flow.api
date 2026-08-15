export declare class CreateVehicleDto {
    make: string;
    model: string;
    year: number;
    registrationNumber: string;
    color: string;
    currentMileage: number;
    nextServiceMileage: number;
    assignedDriverId?: string;
}
export declare class UpdateVehicleDto {
    make?: string;
    model?: string;
    year?: number;
    registrationNumber?: string;
    color?: string;
    currentMileage?: number;
    nextServiceMileage?: number;
    assignedDriverId?: string;
}
export declare class LinkDriverDto {
    driverId?: string;
}
