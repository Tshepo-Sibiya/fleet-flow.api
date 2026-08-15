import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto, LinkDriverDto } from './dto/vehicle.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../../schemas/user.schema';

@ApiTags('Vehicles')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Add New Fleet Vehicle', description: 'Creates a new vehicle with make, model, registration, color, and service mileage targets.' })
  async create(@Request() req, @Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(req.user._id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List Vehicles', description: 'Lists all vehicles for Owner or linked vehicle for Driver.' })
  async findAll(@Request() req) {
    if (req.user.role === UserRole.DRIVER) {
      const v = await this.vehiclesService.findOneForDriver(req.user._id);
      return v ? [v] : [];
    }
    return this.vehiclesService.findAllForOwner(req.user._id);
  }

  @Get('my-vehicle')
  @ApiOperation({ summary: 'Get Driver Linked Vehicle', description: 'Returns vehicle details and service status for logged in Driver.' })
  async getMyVehicle(@Request() req) {
    return this.vehiclesService.findOneForDriver(req.user._id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Vehicle by ID' })
  async findOne(@Request() req, @Param('id') id: string) {
    return this.vehiclesService.findOne(id, req.user._id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Vehicle Details', description: 'Update odometer reading or next service mileage.' })
  async update(@Request() req, @Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, req.user._id, dto);
  }

  @Patch(':id/link-driver')
  @ApiOperation({ summary: 'Link Driver to Vehicle', description: 'Assigns or unlinks a driver from a vehicle.' })
  async linkDriver(@Request() req, @Param('id') id: string, @Body() dto: LinkDriverDto) {
    return this.vehiclesService.linkDriver(id, req.user._id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Vehicle' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.vehiclesService.remove(id, req.user._id);
  }
}
