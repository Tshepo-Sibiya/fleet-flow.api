import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdvancesService } from './advances.service';
import { CreateAdvanceRequestDto, UpdateAdvanceStatusDto } from './dto/advance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Advances')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('advances')
export class AdvancesController {
  constructor(private readonly advancesService: AdvancesService) {}

  @Post()
  @ApiOperation({ summary: 'Request Cash Advance', description: 'Allows drivers to request a mid-week cash advance.' })
  async create(@Request() req, @Body() dto: CreateAdvanceRequestDto) {
    return this.advancesService.createRequest(req.user._id, dto);
  }

  @Post('early-cashout')
  @ApiOperation({ summary: 'Request Early Cashout', description: 'Allows drivers to request an early cashout from weekly earnings.' })
  async requestEarlyCashout(@Request() req, @Body() dto: CreateAdvanceRequestDto) {
    return this.advancesService.createRequest(req.user._id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List Advance Requests', description: 'Returns all advance requests for Owner or Driver.' })
  async findAll(@Request() req) {
    return this.advancesService.findAllForUser(req.user);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Approve or Reject Advance Request', description: 'Owner approves or rejects a pending driver advance request.' })
  async updateStatus(@Request() req, @Param('id') id: string, @Body() dto: UpdateAdvanceStatusDto) {
    return this.advancesService.updateStatus(id, req.user._id, dto);
  }
}
