import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AdvancesService } from './advances.service';
import { CreateAdvanceRequestDto, UpdateAdvanceStatusDto } from './dto/advance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('advances')
export class AdvancesController {
  constructor(private readonly advancesService: AdvancesService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateAdvanceRequestDto) {
    return this.advancesService.createRequest(req.user._id, dto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.advancesService.findAllForUser(req.user);
  }

  @Patch(':id/status')
  async updateStatus(@Request() req, @Param('id') id: string, @Body() dto: UpdateAdvanceStatusDto) {
    return this.advancesService.updateStatus(id, req.user._id, dto);
  }
}
