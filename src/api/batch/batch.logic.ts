import { Injectable } from '@nestjs/common';
import { BatchRepository } from './batch.data';

@Injectable()
export class BatchService {
  constructor(private readonly batchRepository: BatchRepository) {}

  async getBatches(skip: number, limit: number) {
    return this.batchRepository.findBatches(skip, limit);
  }
}
