import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @Min(0)
  currentMileage: number;

  @IsNumber()
  @Min(0)
  nextServiceMileage: number;

  @IsString()
  @IsOptional()
  assignedDriverId?: string;
}

export class UpdateVehicleDto {
  @IsString()
  @IsOptional()
  make?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  currentMileage?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  nextServiceMileage?: number;

  @IsString()
  @IsOptional()
  assignedDriverId?: string;
}

export class LinkDriverDto {
  @IsString()
  @IsOptional()
  driverId?: string; // null or driver id
}
