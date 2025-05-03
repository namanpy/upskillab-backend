import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Doubt, DoubtMessage } from 'src/schemas/doubt-session.schema';

@Injectable()
export class DoubtSessionDataService {
  constructor(@InjectModel(Doubt.name) private doubtModel: Model<Doubt>) {}

  async createDoubt(data: {
    studentId: Types.ObjectId;
    courseId: Types.ObjectId;
    question: string;
    attachments?: string[];
  }) {
    const doubt = new this.doubtModel(data);
    return doubt.save();
  }

  async addMessageToDoubt(doubtId: string, message: DoubtMessage) {
    return this.doubtModel.findByIdAndUpdate(
      doubtId,
      { $push: { messages: message } },
      { new: true },
    );
  }

  async getDoubtById(doubtId: string) {
    return this.doubtModel.findById(doubtId).lean().exec();
  }
}
