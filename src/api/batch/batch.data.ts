import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Batch, BatchDocuments } from 'src/schemas/course/batch.schema';
import { Course } from 'src/schemas/course/course.schema';

@Injectable()
export class BatchDataService {
  constructor(@InjectModel(Batch.name) private batchModel: Model<Batch>) {}

  /**
   *
   * Get latest batch, which will start in future
   *
   */
  async getLatestBatchForCourse(input: { courseId: string | Types.ObjectId }) {
    const { courseId } = input;

    const existingBatch = await this.batchModel
      .findOne({
        course: courseId,
        startDate: { $gt: new Date() },
      })
      .sort({
        startDate: 1,
      })
      .lean()
      .exec();

    return existingBatch;
  }
}
@Injectable()
export class BatchRepository {
  constructor(@InjectModel(Batch.name) private batchModel: Model<BatchDocuments>) {}

  async findBatches(skip: number, limit: number) {
    return this.batchModel
    .find()
    .skip(skip)
    .populate<{
      Category:
        | Course
        | (undefined extends Batch['course'] ? undefined : never);
    }>({
      path: 'course',
    })
    .limit(limit)
    .exec();
  }
}
