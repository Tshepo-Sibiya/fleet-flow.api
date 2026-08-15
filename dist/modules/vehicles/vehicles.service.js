"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const vehicle_schema_1 = require("../../schemas/vehicle.schema");
const user_schema_1 = require("../../schemas/user.schema");
let VehiclesService = class VehiclesService {
    constructor(vehicleModel, userModel) {
        this.vehicleModel = vehicleModel;
        this.userModel = userModel;
    }
    async create(ownerId, dto) {
        const existing = await this.vehicleModel.findOne({
            registrationNumber: dto.registrationNumber.toUpperCase(),
        });
        if (existing) {
            throw new common_1.BadRequestException('Vehicle registration number already exists');
        }
        if (dto.assignedDriverId) {
            const driver = await this.userModel.findById(dto.assignedDriverId);
            if (!driver || driver.role !== user_schema_1.UserRole.DRIVER) {
                throw new common_1.BadRequestException('Assigned driver not found or invalid role');
            }
        }
        const vehicle = await this.vehicleModel.create({
            ...dto,
            registrationNumber: dto.registrationNumber.toUpperCase(),
            ownerId,
        });
        return this.enrichVehicle(vehicle);
    }
    async findAllForOwner(ownerId) {
        const vehicles = await this.vehicleModel
            .find({ ownerId })
            .populate('assignedDriverId', 'fullName email phoneNumber role')
            .exec();
        return vehicles.map((v) => this.enrichVehicle(v));
    }
    async findOneForDriver(driverId) {
        const vehicle = await this.vehicleModel
            .findOne({ assignedDriverId: driverId })
            .populate('ownerId', 'fullName email phoneNumber')
            .exec();
        if (!vehicle) {
            return null;
        }
        return this.enrichVehicle(vehicle);
    }
    async findOne(id, ownerId) {
        const vehicle = await this.vehicleModel
            .findOne({ _id: id, ownerId })
            .populate('assignedDriverId', 'fullName email phoneNumber role')
            .exec();
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        return this.enrichVehicle(vehicle);
    }
    async update(id, ownerId, dto) {
        const vehicle = await this.vehicleModel.findOne({ _id: id, ownerId });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        if (dto.registrationNumber) {
            dto.registrationNumber = dto.registrationNumber.toUpperCase();
        }
        Object.assign(vehicle, dto);
        await vehicle.save();
        return this.enrichVehicle(vehicle);
    }
    async linkDriver(id, ownerId, dto) {
        const vehicle = await this.vehicleModel.findOne({ _id: id, ownerId });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        if (dto.driverId) {
            const driver = await this.userModel.findById(dto.driverId);
            if (!driver || driver.role !== user_schema_1.UserRole.DRIVER) {
                throw new common_1.BadRequestException('Invalid driver selected');
            }
            vehicle.assignedDriverId = dto.driverId;
        }
        else {
            vehicle.assignedDriverId = null;
        }
        await vehicle.save();
        return this.vehicleModel
            .findById(vehicle._id)
            .populate('assignedDriverId', 'fullName email phoneNumber role')
            .exec();
    }
    async remove(id, ownerId) {
        const res = await this.vehicleModel.deleteOne({ _id: id, ownerId });
        if (res.deletedCount === 0) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        return { message: 'Vehicle deleted successfully' };
    }
    enrichVehicle(vehicle) {
        const obj = vehicle.toObject ? vehicle.toObject() : vehicle;
        const kmRemaining = (obj.nextServiceMileage || 0) - (obj.currentMileage || 0);
        return {
            ...obj,
            kmRemainingForService: kmRemaining,
            isServiceDue: kmRemaining <= 1000,
        };
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(vehicle_schema_1.Vehicle.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map