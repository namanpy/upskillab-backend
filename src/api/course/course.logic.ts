import { Injectable } from '@nestjs/common';
import { CourseDataService } from './course.data';
import { BatchDataService } from '../batch/batch.data';

@Injectable()
export class CourseLogicService {
  constructor(
    private courseDataService: CourseDataService,
    private batchDataService: BatchDataService,
  ) {}

  //   async createCourse(input: Omit<Course, '_id'>) {
  //     await this.courseDataService.createCourse(input);

  //     return {
  //       isSuccess: true,
  //     };
  //   }

  async getCourseDisplay(input: { skip?: number; limit?: number }) {
    const { data, count } = await this.courseDataService.getCourse(input);

    const formattedData = await Promise.all(
      data.map(async (course) => {
        const batch = await this.batchDataService.getLatestBatchForCourse({
          courseId: course._id,
        });

        return {
          ...course,
          seatsAvailable: batch?.remainingSeats || 0,
          courseRating: 4.8,
        };
      }),
    );

    return {
      data: formattedData,
      count,
    };
  }

  //   async updateCourse(
  //     input: {
  //       courseId: string;
  //     } & Omit<Course, '_id'>,
  //   ) {
  //     const { courseId, ...update } = input;
  //     await this.courseDataService.updateCourse({
  //       courseId,
  //       update,
  //     });

  //     return {
  //       isSuccess: true,
  //     };
  //   }
}
