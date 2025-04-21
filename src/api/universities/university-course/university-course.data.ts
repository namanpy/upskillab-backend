import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UniversityCourse, UniversityCourseDocument } from '../../../schemas/universities/university-course.schema';
import { CreateUniversityCourseDto } from '../../../dto/universities/university-course.dto';

@Injectable()
export class UniversityCourseDataService {
  constructor(@InjectModel(UniversityCourse.name) private universityCourseModel: Model<UniversityCourseDocument>) {}

  async createCourse(createCourseDto: CreateUniversityCourseDto & { universityId: string }): Promise<UniversityCourseDocument> {
    const newCourse = new this.universityCourseModel(createCourseDto);
    return newCourse.save();
  }

  async getCoursesByUniversityId(universityId: string, query: any = {}): Promise<UniversityCourseDocument[]> {
    return this.universityCourseModel.find({ ...query, universityId }).exec();
  }

  async updateCourse(universityId: string, courseId: string, updateCourseDto: Partial<CreateUniversityCourseDto>): Promise<UniversityCourseDocument | null> {
    return this.universityCourseModel.findOneAndUpdate({ _id: courseId, universityId }, updateCourseDto, { new: true }).exec();
  }
}