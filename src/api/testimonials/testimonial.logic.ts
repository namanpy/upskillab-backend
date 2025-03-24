import { Injectable } from '@nestjs/common';
import { TestimonialDataService } from './testimonial.data';

@Injectable()
export class TestimonialLogicService {
  constructor(private testimonialDataService: TestimonialDataService) {}

  getTestimonials() {
    return this.testimonialDataService.getTestimonials();
  }
}
