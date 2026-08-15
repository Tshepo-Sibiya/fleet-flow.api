import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { SettlementsService } from './settlements.service';
import { CalculateSettlementDto, CreateSettlementDto } from './dto/settlement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('settlements')
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  @Post('calculate')
  async calculatePreview(@Request() req, @Body() dto: CalculateSettlementDto) {
    return this.settlementsService.calculatePreview(req.user._id, dto);
  }

  @Post()
  async createSettlement(@Request() req, @Body() dto: CreateSettlementDto) {
    return this.settlementsService.createSettlement(req.user._id, dto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.settlementsService.findAllForUser(req.user);
  }

  @Get('summary')
  async getFinancialSummary(@Request() req) {
    return this.settlementsService.getFinancialSummary(req.user);
  }
}
