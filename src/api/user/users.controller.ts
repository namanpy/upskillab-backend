import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TestimonialLogicService } from 'src/api/testimonials/testimonial.logic';
import { GetTestimonialsResponseDTO } from '../../dto/testimonial.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';

@Controller('users')
export class UsersController {
  usersService: any;
  constructor(private usersLogicService: TestimonialLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get testimonials',
    type: GetTestimonialsResponseDTO,
  })
  @Get()
  findAll() {
    return { message: 'Users route is working!' };
  }
}
