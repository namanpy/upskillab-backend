import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DemoSession, DemoSessionDocument } from '../../schemas/demosession.schema';
import { CreateDemoSessionDto } from '../../dto/demosession.dto';

@Injectable()
export class DemoSessionDataService {
  constructor(
    @InjectModel(DemoSession.name) private demoSessionModel: Model<DemoSessionDocument>,
  ) {}

  async getDemoSessions(): Promise<DemoSessionDocument[]> {
    return this.demoSessionModel.find().exec();
  }

  async createDemoSession(createDemoSessionDto: CreateDemoSessionDto): Promise<DemoSessionDocument> {
    const newDemoSession = new this.demoSessionModel(createDemoSessionDto);
    return newDemoSession.save();
  }

  async getDemoSessionById(id: string): Promise<DemoSessionDocument | null> {
    return this.demoSessionModel.findById(id).exec();
  }

  async updateDemoSession(
    id: string,
    updateDemoSessionDto: Partial<CreateDemoSessionDto>,
  ): Promise<DemoSessionDocument | null> {
    return this.demoSessionModel
      .findByIdAndUpdate(id, updateDemoSessionDto, { new: true })
      .exec();
  }

  async deleteDemoSession(id: string): Promise<DemoSessionDocument | null> {
    return this.demoSessionModel.findByIdAndDelete(id).exec();
  }
}