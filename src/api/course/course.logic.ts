import { Injectable } from '@nestjs/common';
import { CourseDataService } from './course.data';
import { BatchDataService } from '../batch/batch.data';
import { CreateCourseRequestDto } from 'src/dto/course/course.dto';
import { TopicDataService } from './topic/topic.data';
import { ChapterDataService } from './chapter/chapter.data';
import { Types } from 'mongoose';

@Injectable()
export class CourseLogicService {
  constructor(
    private courseDataService: CourseDataService,
    private topicDataService: TopicDataService,
    private chapterDataService: ChapterDataService,
    private batchDataService: BatchDataService,
  ) {}

  async createCourse(createCourseDto: CreateCourseRequestDto) {
    // Create the course first
    const course = await this.courseDataService.createCourse({
      ...createCourseDto,
      category: Types.ObjectId.createFromHexString(createCourseDto.category),
    });

    // Create chapters and topics
    for (const chapterDto of createCourseDto.chapters) {
      const chapter = await this.chapterDataService.createChapter({
        ...chapterDto,
        course: course._id,
      });

      // Create topics for each chapter
      for (const topicDto of chapterDto.topics) {
        await this.topicDataService.createTopic({
          ...topicDto,
          chapter: chapter._id,
        });
      }
    }
    return {
      isSuccess: true,
    };
  }

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
