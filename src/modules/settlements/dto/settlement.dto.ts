import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CalculateSettlementDto {
  @IsString()
  @IsNotEmpty()
  driverId: string;

  @IsNumber()
  @Min(0)
  uberGrossPayout: number; // e.g. 5000

  @IsNumber()
  @Min(0)
  @IsOptional()
  requestedDebtDeduction?: number; // e.g. 300 (defaults to full debt or 0)

  @IsDateString()
  @IsOptional()
  weekStartDate?: string; // "YYYY-MM-DD"
}

export class CreateSettlementDto extends CalculateSettlementDto {
  @IsString()
  @IsOptional()
  notes?: string;
}
