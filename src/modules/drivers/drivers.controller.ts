import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { InviteDriverDto } from './dto/driver.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../../schemas/user.schema';

@ApiTags('Drivers')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @ApiOperation({ summary: 'Invite Uber Driver via Resend Email', description: 'Owner invites driver by entering name, email, and vehicle link. Sends invitation email via Resend.' })
  async inviteDriver(@Request() req, @Body() dto: InviteDriverDto) {
    return this.driversService.inviteDriver(req.user._id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List Fleet Drivers', description: 'Lists drivers for Owner with active debt balances, check-in rates, and assigned vehicles.' })
  async findAll(@Request() req) {
    if (req.user.role === UserRole.DRIVER) {
      return [await this.driversService.getDriverDetails(req.user._id)];
    }
    return this.driversService.findAllForOwner(req.user._id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Driver Details & Owed Debt Balance' })
  async findOne(@Param('id') id: string) {
    return this.driversService.getDriverDetails(id);
  }
}
