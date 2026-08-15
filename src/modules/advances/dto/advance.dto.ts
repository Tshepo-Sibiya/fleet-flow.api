import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { AdvanceStatus, AdvanceType } from '../../../schemas/advance-request.schema';

export class CreateAdvanceRequestDto {
  @ApiProperty({ example: 500, description: 'Requested advance amount in ZAR' })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'Emergency tire replacement', description: 'Reason for cash advance' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({ enum: AdvanceType, default: AdvanceType.REGULAR_ADVANCE, description: 'Type of advance request' })
  @IsEnum(AdvanceType)
  @IsOptional()
  type?: AdvanceType;
}

export class UpdateAdvanceStatusDto {
  @ApiProperty({ enum: AdvanceStatus, example: AdvanceStatus.APPROVED, description: 'New status for advance request' })
  @IsEnum(AdvanceStatus)
  @IsNotEmpty()
  status: AdvanceStatus;

  @ApiPropertyOptional({ example: 'Approved by Fleet Owner' })
  @IsString()
  @IsOptional()
  notes?: string;
}
