import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthLogicService } from './auth.logic';
import { AuthLoginRequestDto, AuthLoginResponseDto } from 'src/dto/auth.dto';
import { OtpLoginRequestDto, OtpLoginResponseDto } from 'src/dto/login-attempt.dto';
import { verifyLoginAttemptRequestDto, verifyLoginAttemptResponseDto } from 'src/dto/verifyLoginAttempt.dto';

@Controller('auth')
export class AuthController {
  constructor(private authLogicService: AuthLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get Users',
  })
  @Get('')
  async getUsers() {
    // TODO : - By Swapnil Pandy
  }

  @ApiBody({
    type: AuthLoginRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User login',
    type: AuthLoginResponseDto,
  })
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    return req.user;
  }
  @ApiResponse({
    status: 200,
    description: 'Get user details',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/details')
  getDetails(@Request() req) {
    return req.user;
  }

  // New OTP login endpoint
  @ApiBody({
   type: OtpLoginRequestDto,
  })
  @ApiResponse({
    type: OtpLoginResponseDto,
   status: 200,
   description: 'OTP Login',
  })
  @Post('/otp-login')
  async otpLogin(@Body() body: OtpLoginRequestDto) {
   return this.authLogicService.sendOtpLogin(body.email);
  }

  @ApiBody({
    type: verifyLoginAttemptRequestDto,
   })
   @ApiResponse({
     type: verifyLoginAttemptResponseDto,
    status: 200,
    description: 'Verify OTP',
   })
  @Post('otp/enter')
async enterOtp(@Body() body: verifyLoginAttemptRequestDto) {
  return this.authLogicService.enterOtp(body);
  }
}

