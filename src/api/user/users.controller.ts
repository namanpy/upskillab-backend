import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { GetTestimonialsResponseDTO } from '../../dto/testimonial.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersLogicService } from './users.logic';

@Controller('users')
export class UsersController {

  constructor(private userslogicservice: UsersLogicService) {
  }
  @ApiResponse({
    status: 200,
    description: 'Get testimonials',
    type: GetTestimonialsResponseDTO,
  })
  @Get('')
  async users(@Query('username') username: string | null, @Query('email') userEmail: string | null) {
    return await this.userslogicservice.users(username || userEmail);
  }
}
