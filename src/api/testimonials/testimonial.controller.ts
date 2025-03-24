import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TestimonialLogicService } from 'src/api/testimonials/testimonial.logic';

@Controller('testimonial')
export class TestimonialController {
  constructor(private testimonialLogicService: TestimonialLogicService) {}

  @Get('')
  getTestimonials() {
    return this.testimonialLogicService.getTestimonials();
  }
}
