import { Injectable, NotFoundException } from '@nestjs/common';
import { BatchDataService } from './batch.data';
import { CreateBatchDto } from '../../dto/course/batch.dto';
import { GetBatchesResponseDTO } from '../../dto/course/batch.dto';
import { Course } from 'src/schemas/course/course.schema';
// import { BatchDocument } from '../../schemas/batch.schema';

@Injectable()
export class BatchLogicService {
  constructor(private batchDataService: BatchDataService) {}

  async getBatches(): Promise<GetBatchesResponseDTO> {
    const batches = await this.batchDataService.getBatches();
    return {
      batches: batches.map((batch) => ({
        _id: batch._id,
        course: batch.course,
        batchCode: batch.batchCode,
        startTime: batch.startTime,
        startDate: batch.startDate,
        totalSeats: batch.totalSeats,
        remainingSeats: batch.remainingSeats,
        duration: batch.duration,
        teacher: batch.teacher,
        active: batch.active,
        createdAt: batch.createdAt,
        updatedAt: batch.updatedAt,
      })),
    };
  }

  async getUpcomingBatches(input: { skip: number; limit: number }) {
    const batches = await this.batchDataService.getUpcomingBatches(input);
    return batches.map((batch) => ({
      ...batch,
      durationInDays: batch.duration,
      courseId: batch.course._id,
      batchId: batch._id,
      courseName: batch.course.courseName,
      fees: batch.course.discountedPrice,
      classMode: batch.course.courseMode,
    }));
  }

 async createBatch(createBatchDto: CreateBatchDto) {
  const batch = await this.batchDataService.createBatch(createBatchDto);
  return {
    batch: {
      _id: batch._id.toString(),
      course: batch.course ? (batch.course as any)._id.toString() : null,
      batchCode: batch.batchCode,
      startDate: batch.startDate.toISOString(),
      totalSeats: batch.totalSeats,
      remainingSeats: batch.remainingSeats,
      duration: batch.duration,
      teacher: batch.teacher ? (batch.teacher as any)._id.toString() : null,
      active: batch.active,
      createdAt: batch.createdAt,
      updatedAt: batch.updatedAt,
    },
  };
}

  async getBatchById(id: string) {
    const batch = await this.batchDataService.getBatchById(id);
    if (!batch) {
      throw new NotFoundException(`Batch with ID ${id} not found`);
    }
    return {
      batch: {
        _id: batch._id.toString(),
        course: batch.course ? batch.course : null,
        batchCode: batch.batchCode,
        startDate: batch.startDate.toISOString(),
        startTime: batch.startTime,
        totalSeats: batch.totalSeats,
        remainingSeats: batch.remainingSeats,
        duration: batch.duration,
        teacher: batch.teacher ? batch.teacher : null,
        active: batch.active,
        createdAt: batch.createdAt,
        updatedAt: batch.updatedAt,
      },
    };
  }

  async updateBatch(
    id: string,
    updateBatchDto: Partial<CreateBatchDto & { imageUrl: string }>,
  ) {
    const batch = await this.batchDataService.updateBatch(id, updateBatchDto);
    if (!batch) {
      throw new NotFoundException(`Batch with ID ${id} not found`);
    }
    return {
      batch: {
        _id: batch._id.toString(),
        course: batch.course ? (batch.course as any)._id.toString() : null,
        startDate: batch.startDate.toISOString(),
        totalSeats: batch.totalSeats,
        remainingSeats: batch.remainingSeats,
        duration: batch.duration,
        teacher: batch.teacher ? (batch.teacher as any)._id.toString() : null,
        active: batch.active,
        createdAt: batch.createdAt,
        updatedAt: batch.updatedAt,
      },
    };
  }

  async deleteBatch(id: string) {
    const batch = await this.batchDataService.deleteBatch(id);
    if (!batch) {
      throw new NotFoundException(`Batch with ID ${id} not found`);
    }
    return { message: 'Batch deleted successfully' };
  }
}
