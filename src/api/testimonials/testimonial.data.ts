import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Testimonial,
  TestimonialDocument,
} from '../../schemas/home/testimonial.schema';
import { CreateTestimonialDto } from '../../dto/home/testimonial.dto';
import { MongooseDocument } from 'src/schemas/common.schema';

@Injectable()
export class TestimonialDataService {
  constructor(
    @InjectModel(Testimonial.name)
    private testimonialModel: Model<TestimonialDocument>,
  ) {}

  async getTestimonials({
    onlyActive = true,
    studentId,
  }: {
    onlyActive?: boolean;
    studentId?: string | Types.ObjectId;
  } = {}): Promise<TestimonialDocument[]> {
    console.log(
      onlyActive
        ? {
            $or: [{ isActive: true }, { isActive: { $exists: false } }],
            ...(studentId && { student: studentId }),
          }
        : {
            ...(studentId && { student: studentId }),
          },
    );
    return this.testimonialModel
      .find(
        onlyActive
          ? {
              $or: [{ isActive: true }, { isActive: { $exists: false } }],
              ...(studentId && { student: studentId }),
            }
          : {
              ...(studentId && { student: studentId }),
            },
      )
      .lean()
      .exec();
  }

  async createTestimonial(
    createTestimonialDto: Omit<Testimonial, keyof MongooseDocument>,
  ): Promise<TestimonialDocument> {
    const newTestimonial = new this.testimonialModel(createTestimonialDto);
    return newTestimonial.save();
  }

  async getTestimonialById(id: string): Promise<TestimonialDocument | null> {
    return this.testimonialModel.findById(id).exec();
  }

  async updateTestimonial(
    id: string,
    updateTestimonialDto: Partial<Testimonial>,
  ): Promise<TestimonialDocument | null> {
    return this.testimonialModel
      .findByIdAndUpdate(id, updateTestimonialDto, { new: true })
      .exec();
  }

  async deleteTestimonial(id: string): Promise<TestimonialDocument | null> {
    return this.testimonialModel.findByIdAndDelete(id).exec();
  }
}
