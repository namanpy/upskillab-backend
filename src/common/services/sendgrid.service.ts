import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.fromEmail = this.configService.get<string>('SMTP_FROM_EMAIL') ?? 'admission@upskillab.com';


    this.transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 465,
      secure: true,
      auth: {
        user: "admission@upskillab.com",
        pass:"Upskillab@123"
      },
    });
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }) {
    try {
      const info = await this.transporter.sendMail({
        from: options.from || this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      return info;
    } catch (error) {
      console.error('SMTP Error:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendOtpEmail(data: { to: string; name: string; otp: string }) {
    const html = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>OTP Verification</h2>
        <p>Hello ${data.name},</p>
        <p>Your OTP is:</p>
        <h3>${data.otp}</h3>
        <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
      </div>
    `;

    return this.sendEmail({
      to: data.to,
      subject: 'Your OTP Code',
      html,
    });
  }

  async sendWelcomeEmail(data: { to: string; name: string }) {
    const html = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h1>Welcome to UpskillLab!</h1>
        <p>Hi ${data.name},</p>
        <p>We're glad to have you onboard. Happy learning!</p>
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
      <h2>Payment Confirmation</h2>
      <p>Hi ${data.name},</p>
      <p>Your payment of ₹${data.amount} for <b>${data.courseName}</b> is confirmed.</p>
      <p>Order ID: ${data.orderId}</p>
    `;

    return this.sendEmail({
      to: data.to,
      subject: 'Payment Confirmation - UpskillLab',
      html,
    });
  }
}
