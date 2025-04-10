import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student } from '../../schemas/student.schema';
import { MongooseDocument } from 'src/schemas/common.schema';

@Injectable()
export class StudentDataService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  async createStudent(createStudentDto: Omit<Student, keyof MongooseDocument>) {
    const student = new this.studentModel(createStudentDto);
    return student.save().then((d) => d.toObject({}));
  }

  async getStudentByUserId(userId: Types.ObjectId) {
    return this.studentModel
      .findOne({ user: userId })
      .lean()
      .exec();
  }

  async updateStudent(
    userId: Types.ObjectId,
    updateStudentDto: Partial<Omit<Student, keyof MongooseDocument>>,
  ) {
    return this.studentModel
      .findOneAndUpdate({ user: userId }, updateStudentDto, { new: true })
      .lean()
      .exec();
  }
}