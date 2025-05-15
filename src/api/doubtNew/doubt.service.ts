import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateDoubtDto } from 'src/dto/doubtNew/create-doubt.dto';
import { CreateMessageDto } from 'src/dto/doubtNew/create-message.dto';
import { Message } from 'src/schemas/doubtNew/doubt-message.schema';
import { Doubt } from 'src/schemas/doubtNew/doubt.schema';
// import { Doubt } from './schemas/doubt.schema';
// import { Message } from './schemas/message.schema';
// import { CreateDoubtDto } from './dto/create-doubt.dto';
// import { CreateMessageDto } from './dto/create-message.dto';


@Injectable()
export class DoubtService {
  constructor(
    @InjectModel(Doubt.name) private doubtModel: Model<Doubt>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async createDoubt(dto: CreateDoubtDto) {
    const doubt = new this.doubtModel(dto);
    await doubt.save();
    return { success: true, doubt };
  }

  async addMessage(dto: CreateMessageDto) {
    const message = new this.messageModel(dto);
    await message.save();
    await this.doubtModel.findByIdAndUpdate(dto.doubt, {
      $push: { messages: message._id },
    });
    return { success: true, message };
  }

  async getUserDoubts(userId: string) {
    return this.doubtModel
      .find({
        $or: [{ student: userId }, { teacher: userId }],
      })
      .populate('student teacher course messages');
  }

  async getDoubtMessages(doubtId: string) {
    return this.messageModel.find({ doubt: doubtId })
    .populate('sender')
    .populate('doubt');
  }
}
