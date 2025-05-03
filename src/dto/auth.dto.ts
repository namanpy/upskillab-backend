import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
export class AuthLoginResponseDto {
  @ApiProperty()
  authToken: string;

  @ApiProperty({ required: false })
  refreshToken?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Access token expiry date/time (ISO string)',
  })
  authTokenExpiryDate?: string;
}

export class OtpLoginRequestDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
export class OtpLoginResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  attemptId: string;
}

export class verifyLoginAttemptRequestDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be between 6 characters.' })
  otpCode: string;

  @ApiProperty({ example: 'attempt_abc123' })
  @IsString()
  @IsNotEmpty()
  attemptId: string;
}

export class verifyLoginAttemptResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'OTP verified' })
  message: string;

  @ApiProperty({ required: false })
  authToken?: string;

  @ApiProperty({ required: false })
  refreshToken?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Access token expiry date/time (ISO string)',
  })
  authTokenExpiryDate?: string;
}

export class RefreshTokenRequestDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class RefreshTokenResponseDto {
  @ApiProperty()
  authToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({
    type: String,
    description: 'Access token expiry date/time (ISO string)',
  })
  authTokenExpiryDate: string;
}
