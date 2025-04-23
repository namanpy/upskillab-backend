import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SendGridService } from 'src/common/services/sendgrid.service';

import { UserDataService } from '../user/users.data';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';
import { LoginAttemptDataService } from '../login-attempt/login-attempt.data';

@Injectable()
export class AuthLogicService {
  loginAttemptService: any;
  constructor(
    private userDataService: UserDataService,
    private jwtService: JwtService,
    private sendGridService: SendGridService,
    private loginAttemptDataService: LoginAttemptDataService,
  ) {}

  async login(input: { identifier: string; password: string }) {
    const { identifier, password } = input;

    const user = await this.userDataService.getUserByEmailOrPhone({
      identifier,
    });

    if (user.password && (await bcrypt.compare(password, user.password))) {
      const authToken = await this.jwtService.signAsync({
        userId: user._id,
        email: user.email,
        mobileNumber: user.mobileNumber,
      });
      return { authToken };
    } else throw new CustomError(ERROR.INVALID_CREDENTIALS);
  }

  // Generate OTP and send it
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtpLogin(email: string) {
    const user = await this.userDataService.getUserByEmailOrPhone({ identifier: email });

    if (!user) {
      throw new CustomError(ERROR.USER_NOT_FOUND);
    }

    const otp = this.generateOTP();

    // Send OTP email
    await this.sendGridService.sendEmail({
      to: email,
      subject: 'Your OTP Code',
      html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
    });

    const attempt = await this.loginAttemptDataService.createLoginAttempt({
      user: user._id.toString(),
      otpCode: otp,
    });

    return { attemptId: attempt._id };
  }
  async enterOtp({ otpCode, attemptId }: { otpCode: string; attemptId: string }) {
    const attempt = await this.loginAttemptDataService.findAttemptById(attemptId);

    if (!attempt) {
      throw new Error('Login attempt not found');
    }

    if (attempt.otpCode === Number(otpCode)) {
      return { success: true, message: 'OTP verified' };
    }

    return { success: false, message: 'Invalid OTP' };
  }
}


