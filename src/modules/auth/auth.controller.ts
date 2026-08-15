import { Controller, Post, Body, Get, Query, Param, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterOwnerDto, LoginDto, SetupDriverCredentialsDto, RegisterDriverWithTokenDto, ChangePasswordDto, ConfirmEmailDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-owner')
  @ApiOperation({ summary: 'Public Registration for Fleet Owners', description: 'Owners are the only role allowed to register directly. Sends confirmation email via Resend.' })
  @ApiResponse({ status: 201, description: 'Registration successful. Confirmation email sent.' })
  @ApiResponse({ status: 400, description: 'Email registered or password mismatch.' })
  async registerOwner(@Body() dto: RegisterOwnerDto) {
    return this.authService.registerOwner(dto);
  }

  @Get('confirm-email')
  @ApiOperation({ summary: 'Confirm Email Address (Browser Email Link)', description: 'Triggered when owner clicks confirmation link.' })
  @ApiQuery({ name: 'token', description: 'Email confirmation token' })
  async confirmEmailLink(@Query('token') token: string, @Res() res: Response) {
    try {
      const result = await this.authService.confirmEmail(token);
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Account Confirmed - FleetFlow</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A192F; color: #FFFFFF; text-align: center; padding: 40px 20px; margin: 0; }
            .card { background-color: #112240; padding: 40px 30px; border-radius: 20px; display: inline-block; border: 1px solid #D4AF37; max-width: 480px; width: 100%; box-sizing: border-box; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
            .icon-circle { width: 72px; height: 72px; background-color: rgba(212, 175, 55, 0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; border: 1px solid #D4AF37; }
            .icon-circle svg { width: 36px; height: 36px; fill: #D4AF37; }
            h1 { color: #FFFFFF; font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 12px; }
            p { color: #94A3B8; font-size: 15px; line-height: 1.6; margin-bottom: 28px; }
            .badge { background-color: rgba(212, 175, 55, 0.2); color: #D4AF37; font-weight: bold; padding: 6px 16px; border-radius: 20px; display: inline-block; font-size: 13px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon-circle">
              <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
            <div class="badge">STATUS: CONFIRMED & ACTIVE</div>
            <h1>Account Email Confirmed!</h1>
            <p>${result.message}</p>
            <p>Your status has been updated in the database. You can now open the FleetFlow app and log in.</p>
          </div>
        </body>
        </html>
      `);
    } catch (err) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Confirmation Error - FleetFlow</title>
          <style>
            body { font-family: sans-serif; background-color: #0A192F; color: #EF4444; text-align: center; padding: 50px; }
            .card { background-color: #112240; padding: 40px; border-radius: 16px; display: inline-block; border: 1px solid #EF4444; max-width: 440px; }
            h2 { margin-top: 0; }
            p { color: #E2E8F0; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Email Confirmation Link Error</h2>
            <p>${err.message || 'Invalid or expired confirmation token.'}</p>
          </div>
        </body>
        </html>
      `);
    }
  }

  @Post('confirm-email')
  @ApiOperation({ summary: 'Confirm Email Address (REST API)', description: 'Direct API endpoint to update user status to isConfirmed: true using token.' })
  async confirmEmailApi(@Body() dto: ConfirmEmailDto) {
    return this.authService.confirmEmail(dto.token);
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login', description: 'Authenticates Owner or Driver and returns JWT token.' })
  @ApiResponse({ status: 200, description: 'JWT authentication token & user payload' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('driver-invite/:token')
  @ApiOperation({ summary: 'Get Driver Invitation Details', description: 'Returns driver invitation details for token code.' })
  async getDriverInvite(@Param('token') token: string) {
    return this.authService.getDriverInvite(token);
  }

  @Post('register-driver-with-token')
  @ApiOperation({ summary: 'Register Driver with Invitation Token Code', description: 'Allows driver to enter token, email, username and password to complete registration.' })
  async registerDriverWithToken(@Body() dto: RegisterDriverWithTokenDto) {
    return this.authService.registerDriverWithToken(dto);
  }

  @Post('setup-driver-credentials')
  @ApiOperation({ summary: 'Setup Driver Password via Invite Token', description: 'Allows invited drivers to set password using token.' })
  async setupDriverCredentials(@Body() dto: SetupDriverCredentialsDto) {
    return this.authService.setupDriverCredentials(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('change-password')
  @ApiOperation({ summary: 'Change Password', description: 'Authenticated endpoint for Owners and Drivers to update password.' })
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user._id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('me')
  @ApiOperation({ summary: 'Get Current User Profile', description: 'Returns authenticated user object.' })
  async getProfile(@Request() req) {
    return req.user;
  }
}
