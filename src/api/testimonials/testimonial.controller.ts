import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TestimonialLogicService } from 'src/api/testimonials/testimonial.logic';
import { GetTestimonialsResponseDTO } from '../../dto/testimonial.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('testimonial')
export class TestimonialController {
  constructor(private testimonialLogicService: TestimonialLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get testimonials',
    type: GetTestimonialsResponseDTO,
  })
  @Get('')
  async getTestimonials(): Promise<GetTestimonialsResponseDTO> {
    return await this.testimonialLogicService.getTestimonials();
  }
}
