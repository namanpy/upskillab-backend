import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UniversityCourse2, UniversityCourse2Document } from '../../../schemas/universities/university-course-2.schema';
import { CreateUniversityCourse2Dto } from '../../../dto/universities/university-course-2.dto';

// @Injectable()
// export class UniversityCourse2DataService {
//   constructor(@InjectModel(UniversityCourse2.name) private universityCourse2Model: Model<UniversityCourse2Document>) {}

//   async getUniversityCourses(): Promise<UniversityCourse2Document[]> {
//     return this.universityCourse2Model.find().exec();
//   }

//   async createUniversityCourse(createUniversityCourseDto: CreateUniversityCourse2Dto & { imageUrl: string }): Promise<UniversityCourse2Document> {
//     const newCourse = new this.universityCourse2Model(createUniversityCourseDto);
//     return newCourse.save();
//   }

//   async getUniversityCourseById(id: string): Promise<UniversityCourse2Document | null> {
//     return this.universityCourse2Model.findById(id).exec();
//   }

//   async updateUniversityCourse(id: string, updateUniversityCourseDto: Partial<CreateUniversityCourse2Dto & { imageUrl?: string }>): Promise<UniversityCourse2Document | null> {
//     return this.universityCourse2Model.findByIdAndUpdate(id, updateUniversityCourseDto, { new: true }).exec();
//   }

//   async deleteUniversityCourse(id: string): Promise<UniversityCourse2Document | null> {
//     return this.universityCourse2Model.findByIdAndDelete(id).exec();
//   }
// }



// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { UniversityCourse2, UniversityCourse2Document } from '../../schemas/university-course-2.schema';
// import { CreateUniversityCourse2Dto } from '../../dto/university-course-2.dto';

@Injectable()
export class UniversityCourse2DataService {
  constructor(@InjectModel(UniversityCourse2.name) private universityCourse2Model: Model<UniversityCourse2Document>) {}

  async getUniversityCourses(): Promise<UniversityCourse2Document[]> {
    return this.universityCourse2Model.find().populate('universityId').exec();
  }

  async createUniversityCourse(createUniversityCourseDto: CreateUniversityCourse2Dto & { imageUrl: string }): Promise<UniversityCourse2Document> {
    const newCourse = new this.universityCourse2Model(createUniversityCourseDto);
    return newCourse.save();
  }

  async getUniversityCourseById(id: string): Promise<UniversityCourse2Document | null> {
    return this.universityCourse2Model.findById(id).populate('universityId').exec();
  }

  async updateUniversityCourse(id: string, updateUniversityCourseDto: Partial<CreateUniversityCourse2Dto & { imageUrl?: string }>): Promise<UniversityCourse2Document | null> {
    return this.universityCourse2Model.findByIdAndUpdate(id, updateUniversityCourseDto, { new: true }).populate('universityId').exec();
  }

  async deleteUniversityCourse(id: string): Promise<UniversityCourse2Document | null> {
    return this.universityCourse2Model.findByIdAndDelete(id).exec();
  }
}