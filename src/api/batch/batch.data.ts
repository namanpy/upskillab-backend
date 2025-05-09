import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Batch, BatchDocument } from '../../schemas/course/batch.schema';
import { CreateBatchDto } from '../../dto/course/batch.dto';
import { Course } from '../../schemas/course/course.schema';
import { Teacher, TeacherDocument } from '../../schemas/teacher.schema';

@Injectable()
export class BatchDataService {
  constructor(
    @InjectModel(Batch.name) private batchModel: Model<BatchDocument>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
  ) {}

  async getBatches() {
    return this.batchModel
      .find()
      .populate<{ course: Course }>('course')
      .populate<{ teacher: TeacherDocument }>('teacher')
      .exec();
  }

async createBatch(createBatchDto: CreateBatchDto): Promise<BatchDocument> {
    const course = await this.courseModel
      .findById(createBatchDto.course)
      .exec();
    if (!course) {
      throw new BadRequestException(
        `Course with ID ${createBatchDto.course} not found`,
      );
    }

    const teacher = await this.teacherModel
      .findById(createBatchDto.teacher)
      .exec();
    if (!teacher) {
      throw new BadRequestException(
        `Teacher with ID ${createBatchDto.teacher} not found`,
      );
    }

    const newBatch = new this.batchModel(createBatchDto);
    return newBatch.save();
  }

  async getBatchById(id: string) {
    return this.batchModel
      .findById(id)
      .populate<{
        course:
          | Course
          | (undefined extends Batch['course'] ? undefined : never);
        teacher:
          | TeacherDocument
          | (undefined extends Batch['teacher'] ? undefined : never);
      }>(['course', 'teacher'])
      .exec();
  }

  async updateBatch(
    id: string,
    updateBatchDto: Partial<CreateBatchDto & { imageUrl: string }>,
  ): Promise<BatchDocument | null> {
    if (updateBatchDto.course) {
      const course = await this.courseModel
        .findById(updateBatchDto.course)
        .exec();
      if (!course) {
        throw new BadRequestException(
          `Course with ID ${updateBatchDto.course} not found`,
        );
      }
    }

    if (updateBatchDto.teacher) {
      const teacher = await this.teacherModel
        .findById(updateBatchDto.teacher)
        .exec();
      if (!teacher) {
        throw new BadRequestException(
          `Teacher with ID ${updateBatchDto.teacher} not found`,
        );
      }
    }

    return this.batchModel
      .findByIdAndUpdate(id, updateBatchDto, { new: true })
      .populate('course')
      .populate('teacher')
      .exec();
  }

  async deleteBatch(id: string): Promise<BatchDocument | null> {
    return this.batchModel.findByIdAndDelete(id).exec();
  }

  async getLatestBatchForCourse(courseId: string) {
    return this.batchModel
      .findOne({ course: courseId })
      .sort({ startDate: -1 })
      .populate('course')
      .populate('teacher')
      .exec();
  }

  async getUpcomingBatches(input: { skip: number; limit: number }) {
    const { skip, limit } = input;
    const batches = await this.batchModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate<{
        course:
          | Course
          | (undefined extends Batch['course'] ? undefined : never);
      }>({
        path: 'course',
      })
      .lean()
      .exec();
    return batches;
  }
}
