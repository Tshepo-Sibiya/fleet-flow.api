import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../../schemas/user.schema';

@UseGuards(JwtAuthGuard)
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  async createDriver(@Request() req, @Body() body: { fullName: string; email: string; phoneNumber?: string; password?: string }) {
    return this.driversService.createDriver(req.user._id, body);
  }

  @Get()
  async findAll(@Request() req) {
    if (req.user.role === UserRole.DRIVER) {
      return [await this.driversService.getDriverDetails(req.user._id)];
    }
    return this.driversService.findAllForOwner(req.user._id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.driversService.getDriverDetails(id);
  }
}
