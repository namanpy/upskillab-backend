import { Injectable } from '@nestjs/common';
import { TestimonialDataService } from './testimonial.data';

@Injectable()
export class TestimonialLogicService {
  constructor(private testimonialDataService: TestimonialDataService) {}

  async getTestimonials() {
    return {
      testimonials: await this.testimonialDataService.getTestimonials(),
    };
  }
}
