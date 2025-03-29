import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { GetTestimonialsResponseDTO } from '../../dto/testimonial.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersLogicService } from './users.logic';

@Controller('users')
export class UsersController {

  constructor(private usersLogicService: UsersLogicService) {}

  @ApiTags('Users')
  @ApiResponse({
    status: 200,
    description: 'Get testimonials',
    type: GetTestimonialsResponseDTO,
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
}
