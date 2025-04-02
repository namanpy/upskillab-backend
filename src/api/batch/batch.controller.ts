import { Controller, Get, Query } from '@nestjs/common';
import { BatchService } from './batch.logic';


@Controller('batches')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Get()
  async getBatches(
    @Query('skip') skip: number, @Query('limit') limit: number) {
    return this.batchService.getBatches(skip, limit);
  }
}



// To get upcoming batches

// GET /batches/upcoming

// Request :
// IN Query
// {
// skip: number;
// limit: number;
// }
// Response:
// {
// courseId: string;
// batchId: string;
// startDate : Date;
// courseName : string;
// fees : number;
// durationInDays: number;
// remainingSeats: number;
// totalSeats: number;
// startTime: Date;
// classMode: string;
// }
