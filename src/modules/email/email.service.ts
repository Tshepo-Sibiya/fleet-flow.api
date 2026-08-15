import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend?: Resend;
  private readonly logger = new Logger(EmailService.name);
  private senderEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.logger.log('Resend EmailGateway initialized successfully.');
    } else {
      this.logger.warn('RESEND_API_KEY missing. Resend email gateway disabled.');
    }
    this.senderEmail = this.configService.get<string>('RESEND_SENDER_EMAIL') || 'FleetFlow <onboarding@resend.dev>';
  }

  async sendOwnerConfirmationEmail(email: string, fullName: string, token: string) {
    const appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    const confirmUrl = `${appUrl}/api/auth/confirm-email?token=${token}`;

    const subject = 'Confirm your FleetFlow Owner Account';
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #0A192F; color: #FFFFFF; padding: 30px; border-radius: 12px;">
        <h2 style="color: #D4AF37; margin-bottom: 8px;">Welcome to FleetFlow, ${fullName}!</h2>
        <p style="font-size: 15px; color: #E2E8F0;">Thank you for registering your fleet organization on FleetFlow.</p>
        <p style="font-size: 15px; color: #E2E8F0;">Please click the button below to confirm your email address and activate your account:</p>
        <div style="margin: 25px 0;">
          <a href="${confirmUrl}" style="background-color: #1E3A8A; color: #FFFFFF; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; border: 1px solid #D4AF37; display: inline-block;">
            Confirm Owner Account
          </a>
        </div>
        <p style="font-size: 12px; color: #94A3B8;">Or copy and paste this link in your browser: <br><a href="${confirmUrl}" style="color: #D4AF37;">${confirmUrl}</a></p>
      </div>
    `;

    return this.sendEmail(email, subject, html);
  }

  async sendDriverInviteEmail(email: string, fullName: string, ownerName: string, inviteToken: string) {
    const appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    const inviteUrl = `${appUrl}/api/auth/driver-invite-landing?token=${inviteToken}`;

    const subject = `Invitation to join ${ownerName}'s Uber Fleet on FleetFlow`;
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #0A192F; color: #FFFFFF; padding: 30px; border-radius: 12px;">
        <h2 style="color: #D4AF37; margin-bottom: 8px;">Hi ${fullName},</h2>
        <p style="font-size: 15px; color: #E2E8F0;">${ownerName} has invited you to join their fleet on FleetFlow.</p>
        <p style="font-size: 15px; color: #E2E8F0;">Click the button below to set up your password and create your driver profile:</p>
        <div style="margin: 25px 0;">
          <a href="${inviteUrl}" style="background-color: #1E3A8A; color: #FFFFFF; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; border: 1px solid #D4AF37; display: inline-block;">
            Accept Invitation & Setup Password
          </a>
        </div>
        <p style="font-size: 12px; color: #94A3B8;">Your email address (${email}) is locked and cannot be changed.</p>
        <p style="font-size: 12px; color: #94A3B8;">Or copy and paste this link: <br><a href="${inviteUrl}" style="color: #D4AF37;">${inviteUrl}</a></p>
      </div>
    `;

    return this.sendEmail(email, subject, html);
  }

  async sendDriverConfirmationEmail(email: string, fullName: string, token: string) {
    const appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    const confirmUrl = `${appUrl}/api/auth/confirm-email?token=${token}`;

    const subject = 'Confirm your FleetFlow Driver Profile';
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #0A192F; color: #FFFFFF; padding: 30px; border-radius: 12px;">
        <h2 style="color: #D4AF37; margin-bottom: 8px;">Hi ${fullName},</h2>
        <p style="font-size: 15px; color: #E2E8F0;">Your driver credentials have been created.</p>
        <p style="font-size: 15px; color: #E2E8F0;">Please click the button below to confirm your driver profile and enable login:</p>
        <div style="margin: 25px 0;">
          <a href="${confirmUrl}" style="background-color: #1E3A8A; color: #FFFFFF; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; border: 1px solid #D4AF37; display: inline-block;">
            Confirm Driver Profile
          </a>
        </div>
        <p style="font-size: 12px; color: #94A3B8;">Or copy and paste this link: <br><a href="${confirmUrl}" style="color: #D4AF37;">${confirmUrl}</a></p>
      </div>
    `;

    return this.sendEmail(email, subject, html);
  }

  private async sendEmail(to: string, subject: string, html: string) {
    if (!this.resend) {
      this.logger.log(`[Mock Email Sent] To: ${to}, Subject: ${subject}`);
      return { id: 'mock-email-id' };
    }

    try {
      const response = await this.resend.emails.send({
        from: this.senderEmail,
        to: [to],
        subject,
        html,
      });
      this.logger.log(`Email sent via Resend to ${to}: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to send email via Resend to ${to}:`, error);
      return null;
    }
  }
}
