import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { University2, University2Document } from '../../../schemas/universities/university2.schema';
import { CreateUniversity2Dto } from '../../../dto/universities/university2.dto';

@Injectable()
export class University2DataService {
  constructor(@InjectModel(University2.name) private university2Model: Model<University2Document>) {}

  async getUniversities(): Promise<University2Document[]> {
    return this.university2Model.find().exec();
  }

  async createUniversity(createUniversityDto: CreateUniversity2Dto): Promise<University2Document> {
    const newUniversity = new this.university2Model(createUniversityDto);
    return newUniversity.save();
  }

  async getUniversityById(id: string): Promise<University2Document | null> {
    return this.university2Model.findById(id).exec();
  }

  async updateUniversity(id: string, updateUniversityDto: Partial<CreateUniversity2Dto>): Promise<University2Document | null> {
    return this.university2Model.findByIdAndUpdate(id, updateUniversityDto, { new: true }).exec();
  }

  async deleteUniversity(id: string): Promise<University2Document | null> {
    return this.university2Model.findByIdAndDelete(id).exec();
  }
}