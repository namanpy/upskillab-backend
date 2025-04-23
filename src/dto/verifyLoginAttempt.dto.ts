import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class verifyLoginAttemptRequestDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Length(6,6, { message: 'OTP must be between 6 characters.' })
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
}