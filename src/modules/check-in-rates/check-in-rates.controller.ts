import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CheckInRatesService } from './check-in-rates.service';
import { SetCheckInRateDto } from './dto/check-in-rate.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('check-in-rates')
export class CheckInRatesController {
  constructor(private readonly checkInRatesService: CheckInRatesService) {}

  @Post()
  async setRate(@Request() req, @Body() dto: SetCheckInRateDto) {
    return this.checkInRatesService.setRate(req.user._id, dto);
  }

  @Get('driver/:driverId')
  async getRateForDriver(@Param('driverId') driverId: string, @Query('weekStartDate') weekStartDate?: string) {
    return this.checkInRatesService.getRateForDriver(driverId, weekStartDate);
  }
}
