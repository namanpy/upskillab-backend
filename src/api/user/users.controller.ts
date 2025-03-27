import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GetTestimonialsResponseDTO } from '../../dto/testimonial.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  usersService: any;
  constructor() {}

  @ApiResponse({
    status: 200,
    description: 'Get testimonials',
    type: GetTestimonialsResponseDTO,
  })
  @Get('')
  async users(): Promise<GetTestimonialsResponseDTO>
  {
    return await this.usersService.users();
  }
  
}
