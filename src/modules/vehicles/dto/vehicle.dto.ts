import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota', description: 'Car Make' })
  @IsString()
  @IsNotEmpty()
  make: string;

  @ApiProperty({ example: 'Corolla Quest', description: 'Car Model' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 2023, description: 'Manufacturing Year' })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ example: 'CA 123-456', description: 'Registration Number' })
  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @ApiProperty({ example: 'White', description: 'Car Color' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: 50000, description: 'Current odometer reading in km' })
  @IsNumber()
  @Min(0)
  currentMileage: number;

  @ApiProperty({ example: 60000, description: 'Target odometer mileage for next service' })
  @IsNumber()
  @Min(0)
  nextServiceMileage: number;

  @ApiPropertyOptional({ example: 'driver_id_here', description: 'Optional assigned driver ID' })
  @IsString()
  @IsOptional()
  assignedDriverId?: string;
}

export class UpdateVehicleDto {
  @ApiPropertyOptional({ example: 'Toyota' })
  @IsString()
  @IsOptional()
  make?: string;

  @ApiPropertyOptional({ example: 'Corolla Quest' })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiPropertyOptional({ example: 2023 })
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiPropertyOptional({ example: 'CA 123-456' })
  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @ApiPropertyOptional({ example: 'White' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ example: 55000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  currentMileage?: number;

  @ApiPropertyOptional({ example: 60000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  nextServiceMileage?: number;

  @ApiPropertyOptional({ example: 'driver_id_here' })
  @IsString()
  @IsOptional()
  assignedDriverId?: string;
}

export class LinkDriverDto {
  @ApiPropertyOptional({ example: 'driver_id_here', description: 'Driver ID to link, or null to unlink' })
  @IsString()
  @IsOptional()
  driverId?: string;
}
