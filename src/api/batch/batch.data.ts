import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';

import { Batch } from 'src/schemas/course/batch.schema';

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
