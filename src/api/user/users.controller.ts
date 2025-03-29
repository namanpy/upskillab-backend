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
  /**
   *
   * To search users either via mobile number or email, or username
   * Note :- Should accept partial search, bonus points for single input only (name : searchString)
   *
   */
  async getUsers() {
    // TODO : - By Swapnil Pandy
  }

  /**
   *
   * Endpoint to update user details
   * Note :- Can take mongodb user _id as input
   *
   */
  async updateUser() {
    // TODO : - By Swapnil Pandy
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
