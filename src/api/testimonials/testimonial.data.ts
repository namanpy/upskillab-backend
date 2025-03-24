import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial } from './testimonial.schema';

@Injectable()
export class TestimonialDataService {
  constructor(
    @InjectModel(Testimonial.name) private testimonialModel: Model<Testimonial>,
  ) {}

  getTestimonials() {
    return [
      {
        name: 'Student Name',
        description: 'Best course ever',
        rating: 5,
      },
    ];
  }
}
