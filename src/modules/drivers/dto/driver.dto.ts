import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InviteDriverDto {
  @ApiProperty({ example: 'Thabo Mokoena', description: 'Full Name of the Uber Driver' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({ example: 'driver.thabo@fleetflow.co.za', description: 'Optional initial email address of the Uber Driver' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+27 73 987 6543', description: 'Phone number' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'vehicle_id_here', description: 'Optional vehicle ID to link driver upon invitation' })
  @IsString()
  @IsOptional()
  vehicleId?: string;
}
