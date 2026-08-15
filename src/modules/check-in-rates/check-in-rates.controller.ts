import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CheckInRatesService } from './check-in-rates.service';
import { SetCheckInRateDto } from './dto/check-in-rate.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Check-In Rates')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('check-in-rates')
export class CheckInRatesController {
  constructor(private readonly checkInRatesService: CheckInRatesService) {}

  @Post()
  @ApiOperation({ summary: 'Set Weekly Check-In Rate', description: 'Sets fixed weekly check-in fee for a driver. Enforces rule that current/started week rates cannot be changed.' })
  async setRate(@Request() req, @Body() dto: SetCheckInRateDto) {
    return this.checkInRatesService.setRate(req.user._id, dto);
  }

  @Get('driver/:driverId')
  @ApiOperation({ summary: 'Get Driver Check-In Rate & Week Lock Status' })
  @ApiQuery({ name: 'weekStartDate', required: false, example: '2026-08-17' })
  async getRateForDriver(@Param('driverId') driverId: string, @Query('weekStartDate') weekStartDate?: string) {
    return this.checkInRatesService.getRateForDriver(driverId, weekStartDate);
  }
}
