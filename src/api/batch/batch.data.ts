import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Batch } from 'src/schemas/course/batch.schema';
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
  async findBatches(skip: number, limit: number) {
    const batches = await this.batchModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate<{
                course:
                  | Course
                  | (undefined extends Batch['course']?undefined :never);
              }>({
                path: 'course',
              })
      .lean()
      .exec();
    return batches;
}
}
