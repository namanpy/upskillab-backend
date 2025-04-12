// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { University, UniversityDocument } from '../../schemas/university.schema';
// import { CreateUniversityDto } from '../../dto/university.dto';

// @Injectable()
// export class UniversityDataService {
//   constructor(@InjectModel(University.name) private universityModel: Model<UniversityDocument>) {}

//   async getUniversities(): Promise<UniversityDocument[]> {
//     return this.universityModel.find().exec();
//   }

//   async createUniversity(createUniversityDto: CreateUniversityDto): Promise<UniversityDocument> {
//     const newUniversity = new this.universityModel(createUniversityDto);
//     return newUniversity.save();
//   }

//   async getUniversityById(id: string): Promise<UniversityDocument | null> {
//     return this.universityModel.findById(id).exec();
//   }

//   async updateUniversity(id: string, updateUniversityDto: Partial<CreateUniversityDto>): Promise<UniversityDocument | null> {
//     return this.universityModel.findByIdAndUpdate(id, updateUniversityDto, { new: true }).exec();
//   }

//   async patchUniversity(id: string, updateUniversityDto: Partial<CreateUniversityDto>): Promise<UniversityDocument | null> {
//     return this.universityModel.findByIdAndUpdate(id, updateUniversityDto, { new: true }).exec();
//   }

//   async deleteUniversity(id: string): Promise<UniversityDocument | null> {
//     return this.universityModel.findByIdAndDelete(id).exec();
//   }
// }


import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { University, UniversityDocument } from '../../schemas/university.schema';
import { CreateUniversityDto, UpdateUniversityDto } from '../../dto/university.dto';

@Injectable()
export class UniversityDataService {
  constructor(@InjectModel(University.name) private universityModel: Model<UniversityDocument>) {}

  async getUniversities(): Promise<UniversityDocument[]> {
    return this.universityModel.find().lean().exec();
  }

  async createUniversity(createUniversityDto: CreateUniversityDto & { imageUrl: string }): Promise<UniversityDocument> {
    const newUniversity = new this.universityModel(createUniversityDto);
    return newUniversity.save();
  }

  async getUniversityById(id: string): Promise<UniversityDocument | null> {
    return this.universityModel.findById(id).lean().exec();
  }

  async updateUniversity(id: string, updateUniversityDto: UpdateUniversityDto): Promise<UniversityDocument | null> {
    return this.universityModel.findByIdAndUpdate(id, updateUniversityDto, { new: true, lean: true }).exec();
  }

  async deleteUniversity(id: string): Promise<UniversityDocument | null> {
    return this.universityModel.findByIdAndDelete(id).lean().exec();
  }
}