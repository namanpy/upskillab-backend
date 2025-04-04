import { Controller, Get, Query } from '@nestjs/common';
import { BatchLogicService } from './batch.logic';
import { ApiResponse } from '@nestjs/swagger';
import { GetBatchesRequestDTO, GetBatchResponseDTO } from 'src/dto/batch.dto';

@Controller('batches')
export class BatchController {
  constructor(private readonly batchLogicService: BatchLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get upcoming batches',
    type:[GetBatchResponseDTO],
  })

  @Get('upcoming')
  async getBatches(
    @Query() query: GetBatchesRequestDTO,
  ): Promise< GetBatchResponseDTO[]> {
    return await this.batchLogicService.getBatches(query.skip, query.limit);
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
