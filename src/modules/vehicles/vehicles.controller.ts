import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto, LinkDriverDto } from './dto/vehicle.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../../schemas/user.schema';

@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(req.user._id, dto);
  }

  @Get()
  async findAll(@Request() req) {
    if (req.user.role === UserRole.DRIVER) {
      const v = await this.vehiclesService.findOneForDriver(req.user._id);
      return v ? [v] : [];
    }
    return this.vehiclesService.findAllForOwner(req.user._id);
  }

  @Get('my-vehicle')
  async getMyVehicle(@Request() req) {
    return this.vehiclesService.findOneForDriver(req.user._id);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.vehiclesService.findOne(id, req.user._id);
  }

  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, req.user._id, dto);
  }

  @Patch(':id/link-driver')
  async linkDriver(@Request() req, @Param('id') id: string, @Body() dto: LinkDriverDto) {
    return this.vehiclesService.linkDriver(id, req.user._id, dto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.vehiclesService.remove(id, req.user._id);
  }
}
