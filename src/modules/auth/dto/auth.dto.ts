import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterOwnerDto {
  @ApiProperty({ example: 'Nkosi Fleet Solutions', description: 'Name of the Fleet Organization / Company' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ example: 'Sipho Nkosi', description: 'Full Name / Username of the Fleet Owner' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'owner@fleetflow.co.za', description: 'Email address of the Fleet Owner' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Owner123!', description: 'Password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Owner123!', description: 'Confirmation password (must match password)' })
  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @ApiPropertyOptional({ example: '+27 82 123 4567', description: 'Contact phone number' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;
}

export class ConfirmEmailDto {
  @ApiProperty({ example: 'a1b2c3d4e5f6...', description: 'Email confirmation token received via email' })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class LoginDto {
  @ApiProperty({ example: 'owner@fleetflow.co.za', description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Owner123!', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SetupDriverCredentialsDto {
  @ApiProperty({ example: 'DRV-8F92A34B', description: 'Driver invitation token code provided by Fleet Owner' })
  @IsString()
  @IsNotEmpty()
  inviteToken: string;

  @ApiProperty({ example: 'Driver123!', description: 'Driver password' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Driver123!', description: 'Confirmation password' })
  @IsString()
  @MinLength(6)
  confirmPassword: string;
}

export class RegisterDriverWithTokenDto {
  @ApiProperty({ example: 'DRV-8F92A34B', description: 'Invitation token code provided by Fleet Owner' })
  @IsString()
  @IsNotEmpty()
  inviteToken: string;

  @ApiProperty({ example: 'driver.thabo@fleetflow.co.za', description: 'Driver Email Address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Thabo Mbeki', description: 'Driver Full Name / Username' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'Driver123!', description: 'Driver password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Driver123!', description: 'Confirmation password (must match password)' })
  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @ApiPropertyOptional({ example: '+27 82 999 8888', description: 'Driver phone number' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPassword123!', description: 'Current password' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'NewPassword123!', description: 'New password' })
  @IsString()
  @MinLength(6)
  newPassword: string;

  @ApiProperty({ example: 'NewPassword123!', description: 'Confirm new password' })
  @IsString()
  @MinLength(6)
  confirmPassword: string;
}
