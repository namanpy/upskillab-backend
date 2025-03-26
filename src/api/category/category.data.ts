import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial } from '../../schemas/testimonial.schema';

@Injectable()
export class CategoryDataService {
  constructor(
    @InjectModel(Testimonial.name) private testimonialModel: Model<Testimonial>,
  ) {}

  async getCategory() {
    return this.testimonialModel.find().lean().exec();
  }
}
