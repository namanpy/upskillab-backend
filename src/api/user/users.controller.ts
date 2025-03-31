import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersLogicService } from './users.logic';

@Controller('users')
export class UsersController {

  constructor(private usersLogicService: UsersLogicService) {}

  @ApiTags('Users')
  @ApiResponse({
    status: 200,
    description: 'Get testimonials',
  })
  @Get('')
  async users(
    @Query() inputs: { username?: string; email?: string; mobileNumber?: string },
  ) {
    const { username, email, mobileNumber } = inputs;
    return await this.usersLogicService.findbyUsernameorEmailorMobile({
      username,
      email,
      mobileNumber,
    });
  }
  @ApiTags('Users')
  @ApiResponse({
    status: 200,
    description: 'Update user details',
  })

  @Put(':_id')
  async updateUser(
    @Body() updateData: { _id: string; username?: string; email?: string; mobileNumber?: string },
  ) {
    const { _id, username, email, mobileNumber } = updateData;
    
    return await this.usersLogicService.updateUserDetails({
      _id,
      username,
      email,
      mobileNumber,
    });
  }
  @ApiResponse({
    status: 200,
    description: 'User login',
  })
  @Post('login')
  async loginUser(@Body() loginDto: { username: string; password: string }) {
    // TODO: Implement login logic
    return {
      message: 'Login successful',
      username: loginDto.username,
    };
  }
}
