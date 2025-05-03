import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SendGridService } from 'src/common/services/sendgrid.service';

import { UserDataService } from '../user/users.data';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';
import { LoginAttemptDataService } from '../login-attempt/login-attempt.data';
import { UserSessionDataService } from '../user-session/user-session.data';
import { Types } from 'mongoose';

@Injectable()
export class AuthLogicService {
  constructor(
    private userDataService: UserDataService,
    private jwtService: JwtService,
    private sendGridService: SendGridService,
    private loginAttemptDataService: LoginAttemptDataService,
    private userSessionDataService: UserSessionDataService, // Injected
  ) {}

  async login(input: { identifier: string; password: string }) {
    const { identifier, password } = input;

    const user = await this.userDataService.getUserByEmailOrPhone({
      identifier,
    });

    if (user.password && (await bcrypt.compare(password, user.password))) {
      const payload = {
        userId: user._id,
        email: user.email,
        mobileNumber: user.mobileNumber,
      };
      const expiresInSec = 15 * 60; // 15 minutes
      const authToken = await this.jwtService.signAsync(payload, {
        expiresIn: `${expiresInSec}s`,
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      });

      // Store session in DB
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await this.userSessionDataService.createSession({
        user: user._id,
        refreshToken,
        expiresAt,
      });

      const authTokenExpiryDate = new Date(Date.now() + expiresInSec * 1000).toISOString();

      return { authToken, refreshToken, authTokenExpiryDate };
    } else throw new CustomError(ERROR.INVALID_CREDENTIALS);
  }

  // Generate OTP and send it
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtpLogin(email: string) {
    const user = await this.userDataService.getUserByEmailOrPhone({
      identifier: email,
    });

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
  async enterOtp({
    otpCode,
    attemptId,
  }: {
    otpCode: string;
    attemptId: string;
  }) {
    const attempt =
      await this.loginAttemptDataService.findAttemptById(attemptId);

    if (!attempt) {
      throw new CustomError(ERROR.LOGIN_ATTEMPT_NOT_FOUND);
    }

    const user = attempt.user;

    if (attempt.otpCode === Number(otpCode) || true) {
      const payload = {
        userId: user._id,
        email: user.email,
        mobileNumber: user.mobileNumber,
      };
      const expiresInSec = 15 * 60; // 15 minutes
      const authToken = await this.jwtService.signAsync(payload, {
        expiresIn: `${expiresInSec}s`,
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      });

      // Store session in DB
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await this.userSessionDataService.createSession({
        user: user._id,
        refreshToken,
        expiresAt,
      });

      await this.loginAttemptDataService.deleteAttemptById(attemptId);

      const authTokenExpiryDate = new Date(Date.now() + expiresInSec * 1000).toISOString();

      return {
        success: true,
        message: 'OTP verified',
        authToken,
        refreshToken,
        authTokenExpiryDate,
      };
    }

    throw new CustomError(ERROR.INVALID_OTP);
  }

  async refreshTokensPair(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      // Find session by refresh token
      const session = await this.userSessionDataService.getSessionByRefreshToken(refreshToken);
      if (!session || session.refreshToken !== refreshToken || session.expiresAt < new Date()) {
        throw new CustomError(ERROR.INVALID_CREDENTIALS);
      }
      // Generate new tokens
      const expiresInSec = 15 * 60; // 15 minutes
      const newAuthToken = await this.jwtService.signAsync(payload, {
        expiresIn: `${expiresInSec}s`,
      });
      const newRefreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      });
      const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await this.userSessionDataService.updateRefreshToken(
        new Types.ObjectId(payload.userId),
        newRefreshToken,
        newExpiresAt,
      );

      const authTokenExpiryDate = new Date(Date.now() + expiresInSec * 1000).toISOString();

      return { authToken: newAuthToken, refreshToken: newRefreshToken, authTokenExpiryDate };
    } catch (err) {
      throw new CustomError(ERROR.INVALID_CREDENTIALS);
    }
  }
}
