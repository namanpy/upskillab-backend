import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  private readonly fromEmail: string;
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    const fromEmail = this.configService.get<string>('SENDGRID_FROM_EMAIL');
    if (!apiKey || !fromEmail)
      throw new Error(
        'SENDGRID_API_KEY or SENDGRID_FROM_EMAIL  not found in environment variables',
      );
    this.fromEmail = fromEmail;
    SendGrid.setApiKey(apiKey);
  }

  async sendEmail(data: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }) {
    try {
      
      const mail = {
        to: data.to,
        subject: data.subject,
        from: data.from || this.fromEmail,
        html: data.html,
      };

      const transport = await SendGrid.send(mail);
      return transport;
    } catch (error) {
      console.error('SendGrid error:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendWelcomeEmail(data: { to: string; name: string }) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2C3E50; text-align: center;">Welcome to UpskillLab! 🎉</h1>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="font-size: 16px; color: #34495E;">Dear ${data.name},</p>
          <p style="font-size: 16px; color: #34495E;">We're excited to have you join our learning community! Your account has been successfully created.</p>
          <p style="color: #34495E;">Start your learning journey today!</p>
        </div>
        <p style="font-size: 12px; color: #7F8C8D; text-align: center;">If you didn't create this account, please contact our support team.</p>
      </div>
    `;

    return this.sendEmail({
      to: data.to,
      subject: 'Welcome to UpskillLab',
      html,
    });
  }

  async sendPaymentConfirmation(data: {
    to: string;
    name: string;
    courseName: string;
    amount: number;
    orderId: string;
  }) {
    const html = `
      <h1>Payment Confirmation</h1>
      <p>Hello ${data.name},</p>
      <p>Your payment for ${data.courseName} has been confirmed.</p>
      <p>Amount: ₹${data.amount}</p>
      <p>Order ID: ${data.orderId}</p>
      <p>Thank you for choosing UpskillLab!</p>
    `;

    return this.sendEmail({
      to: data.to,
      subject: 'Payment Confirmation - UpskillLab',
      html,
    });
  }
}
