import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthLogicService } from './auth.logic';
import { AuthLoginRequestDto, AuthLoginResponseDto } from 'src/dto/auth.dto';

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
   @ApiResponse({
    status: 200,
    description: 'OTP Login',
  })
  @Post('/otp-login')
  async otpLogin(@Body() body: { email: string }) {
    return this.authLogicService.sendOtpLogin(body.email);
  }
}
