import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CalculateSettlementDto {
  @ApiProperty({ example: 'driver_id_here', description: 'Driver ID' })
  @IsString()
  @IsNotEmpty()
  driverId: string;

  @ApiProperty({ example: 5000, description: 'Uber Gross Weekly Payout captured in ZAR' })
  @IsNumber()
  @Min(0)
  uberGrossPayout: number;

  @ApiPropertyOptional({ example: 300, description: 'Agreed debt repayment deduction (e.g. R300 out of R600 owed)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  requestedDebtDeduction?: number;

  @ApiPropertyOptional({ example: '2026-08-17', description: 'Target week Monday date string (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  weekStartDate?: string;
}

export class CreateSettlementDto extends CalculateSettlementDto {
  @ApiPropertyOptional({ example: 'Driver agreed to pay R300 partial debt this week', description: 'Settlement notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}
