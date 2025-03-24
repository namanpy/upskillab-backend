import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TestimonialLogicService } from 'src/api/testimonials/testimonial.logic';
import { GetTestimonialsResponseDTO } from '../../dto/testimonial.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private usersLogicService: TestimonialLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get testimonials',
    type: GetTestimonialsResponseDTO,
  })
  @Get('')
  async getUsers() {
    // TODO : - By Swapnil Pandy
  }
}
