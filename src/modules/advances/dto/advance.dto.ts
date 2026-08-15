import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { AdvanceStatus } from '../../../schemas/advance-request.schema';

export class CreateAdvanceRequestDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class UpdateAdvanceStatusDto {
  @IsEnum(AdvanceStatus)
  @IsNotEmpty()
  status: AdvanceStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
