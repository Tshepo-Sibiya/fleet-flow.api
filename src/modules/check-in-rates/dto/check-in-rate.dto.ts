import { IsDateString, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class SetCheckInRateDto {
  @IsString()
  @IsNotEmpty()
  driverId: string;

  @IsNumber()
  @Min(0)
  weeklyAmount: number;

  @IsDateString()
  @IsNotEmpty()
  effectiveWeekStart: string; // "YYYY-MM-DD" (Monday of target week)
}
