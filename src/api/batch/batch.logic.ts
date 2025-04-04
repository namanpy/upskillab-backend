import { Injectable } from '@nestjs/common';
import { BatchDataService} from './batch.data';

@Injectable()
export class BatchLogicService {
  batchDataService: any;
  constructor(private readonly batchRepository: BatchDataService) {}

  async getBatches(skip: number, limit: number) {
    const batches = await this.batchRepository.findBatches(skip, limit);{
      return batches.map(batch => ({
        ...batch,
        courseId: batch.course._id,
        batchId: batch._id,
        courseName: batch.course.courseName,
        fees: batch.course.discountedPrice,
        classMode: batch.course.courseMode,
    }));
  }
}
}
