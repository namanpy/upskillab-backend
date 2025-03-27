import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial, TestimonialDocument } from '../../schemas/home/testimonial.schema';
import { CreateTestimonialDto } from '../../dto/home/testimonial.dto';

@Injectable()
export class TestimonialDataService {
  constructor(
    @InjectModel(Testimonial.name) private testimonialModel: Model<TestimonialDocument>,
  ) {}

  async getTestimonials(): Promise<TestimonialDocument[]> {
    return this.testimonialModel.find().exec();
  }

  async createTestimonial(createTestimonialDto: CreateTestimonialDto): Promise<TestimonialDocument> {
    const newTestimonial = new this.testimonialModel(createTestimonialDto);
    return newTestimonial.save();
  }

  async getTestimonialById(id: string): Promise<TestimonialDocument | null> {
    return this.testimonialModel.findById(id).exec();
  }

  async updateTestimonial(
    id: string,
    updateTestimonialDto: Partial<CreateTestimonialDto>,
  ): Promise<TestimonialDocument | null> {
    return this.testimonialModel
      .findByIdAndUpdate(id, updateTestimonialDto, { new: true })
      .exec();
  }

  async deleteTestimonial(id: string): Promise<TestimonialDocument | null> {
    return this.testimonialModel.findByIdAndDelete(id).exec();
  }
}