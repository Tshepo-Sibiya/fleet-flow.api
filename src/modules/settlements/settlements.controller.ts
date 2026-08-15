import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettlementsService } from './settlements.service';
import { CalculateSettlementDto, CreateSettlementDto } from './dto/settlement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Settlements')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('settlements')
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Preview Weekly Settlement Calculation', description: 'Calculates live preview of Owner share, Net Driver Payout, and Carried-Over Debt balance given Uber gross payout & agreed debt deduction.' })
  async calculatePreview(@Request() req, @Body() dto: CalculateSettlementDto) {
    return this.settlementsService.calculatePreview(req.user._id, dto);
  }

  @Post()
  @ApiOperation({ summary: 'Commit Weekly Settlement', description: 'Records weekly settlement in database and updates driver carried-over debt balance.' })
  async createSettlement(@Request() req, @Body() dto: CreateSettlementDto) {
    return this.settlementsService.createSettlement(req.user._id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List Weekly Settlements History' })
  async findAll(@Request() req) {
    return this.settlementsService.findAllForUser(req.user);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get Financial Overview (Weekly & Monthly)', description: 'Returns weekly and monthly gross earnings, owner total earned, driver net payouts, and debt collected.' })
  async getFinancialSummary(@Request() req) {
    return this.settlementsService.getFinancialSummary(req.user);
  }
}
