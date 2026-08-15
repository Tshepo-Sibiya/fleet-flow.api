import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from '../../schemas/vehicle.schema';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';
import { CreateVehicleDto, UpdateVehicleDto, LinkDriverDto } from './dto/vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(ownerId: string, dto: CreateVehicleDto) {
    const existing = await this.vehicleModel.findOne({
      registrationNumber: dto.registrationNumber.toUpperCase(),
    });
    if (existing) {
      throw new BadRequestException('Vehicle registration number already exists');
    }

    if (dto.assignedDriverId) {
      const driver = await this.userModel.findById(dto.assignedDriverId);
      if (!driver || driver.role !== UserRole.DRIVER) {
        throw new BadRequestException('Assigned driver not found or invalid role');
      }
    }

    const vehicle = await this.vehicleModel.create({
      ...dto,
      registrationNumber: dto.registrationNumber.toUpperCase(),
      ownerId,
    });

    return this.enrichVehicle(vehicle);
  }

  async findAllForOwner(ownerId: string) {
    const vehicles = await this.vehicleModel
      .find({ ownerId })
      .populate('assignedDriverId', 'fullName email phoneNumber role')
      .exec();
    return vehicles.map((v) => this.enrichVehicle(v));
  }

  async findOneForDriver(driverId: string) {
    const vehicle = await this.vehicleModel
      .findOne({ assignedDriverId: driverId })
      .populate('ownerId', 'fullName email phoneNumber')
      .exec();
    if (!vehicle) {
      return null;
    }
    return this.enrichVehicle(vehicle);
  }

  async findOne(id: string, ownerId: string) {
    const vehicle = await this.vehicleModel
      .findOne({ _id: id, ownerId })
      .populate('assignedDriverId', 'fullName email phoneNumber role')
      .exec();
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return this.enrichVehicle(vehicle);
  }

  async update(id: string, ownerId: string, dto: UpdateVehicleDto) {
    const vehicle = await this.vehicleModel.findOne({ _id: id, ownerId });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (dto.registrationNumber) {
      dto.registrationNumber = dto.registrationNumber.toUpperCase();
    }

    Object.assign(vehicle, dto);
    await vehicle.save();
    return this.enrichVehicle(vehicle);
  }

  async linkDriver(id: string, ownerId: string, dto: LinkDriverDto) {
    const vehicle = await this.vehicleModel.findOne({ _id: id, ownerId });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (dto.driverId) {
      const driver = await this.userModel.findById(dto.driverId);
      if (!driver || driver.role !== UserRole.DRIVER) {
        throw new BadRequestException('Invalid driver selected');
      }
      vehicle.assignedDriverId = dto.driverId;
    } else {
      vehicle.assignedDriverId = null;
    }

    await vehicle.save();
    return this.vehicleModel
      .findById(vehicle._id)
      .populate('assignedDriverId', 'fullName email phoneNumber role')
      .exec();
  }

  async remove(id: string, ownerId: string) {
    const res = await this.vehicleModel.deleteOne({ _id: id, ownerId });
    if (res.deletedCount === 0) {
      throw new NotFoundException('Vehicle not found');
    }
    return { message: 'Vehicle deleted successfully' };
  }

  private enrichVehicle(vehicle: VehicleDocument) {
    const obj = vehicle.toObject ? vehicle.toObject() : vehicle;
    const kmRemaining = (obj.nextServiceMileage || 0) - (obj.currentMileage || 0);
    return {
      ...obj,
      kmRemainingForService: kmRemaining,
      isServiceDue: kmRemaining <= 1000, // Alert if within 1000km
    };
  }
}
