import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MongooseDocument } from 'src/schemas/common.schema';
import { Batch } from 'src/schemas/course/batch.schema';
import { Course } from 'src/schemas/course/course.schema';
import { Doubt, DoubtMessage } from 'src/schemas/doubt-session.schema';
import { Student } from 'src/schemas/student.schema';
import { Teacher } from 'src/schemas/teacher.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class DoubtSessionDataService {
  constructor(@InjectModel(Doubt.name) private doubtModel: Model<Doubt>) {}

  async createDoubt(data: {
    studentId: Types.ObjectId;
    courseId: Types.ObjectId;
    teacherId: Types.ObjectId;
    question: string;
    attachments?: string[];
  }) {
    const doubt = new this.doubtModel({
      student: data.studentId,
      course: data.courseId,
      teacher: data.teacherId,
      question: data.question,
      attachments: data.attachments,
    });
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

  async getDoubts(input: {
    studentId?: string | Types.ObjectId;
    teacherId?: string | Types.ObjectId;
  }) {
    return this.doubtModel
      .find({
        ...(input.studentId && { student: input.studentId }),
        ...(input.teacherId && { teacher: input.teacherId }),
      })
      .populate<{ course: Course & MongooseDocument }>('course')
      .populate<{ student: Student & MongooseDocument }>('student')
      .populate<{ teacher: Teacher & MongooseDocument }>('teacher')
      .populate<{
        messages: (Omit<DoubtMessage & MongooseDocument, 'user'> & {
          user: User;
        })[];
      }>('messages.user')
      .lean()
      .exec();
  }
}
