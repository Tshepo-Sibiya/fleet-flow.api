import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class SetCheckInRateDto {
  @ApiProperty({ example: 'driver_id_here', description: 'Driver ID' })
  @IsString()
  @IsNotEmpty()
  driverId: string;

  @ApiProperty({ example: 2200, description: 'Fixed weekly check-in amount in ZAR' })
  @IsNumber()
  @Min(0)
  weeklyAmount: number;

  @ApiProperty({ example: '2026-08-24', description: 'Effective week Monday date string (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  effectiveWeekStart: string;
}
