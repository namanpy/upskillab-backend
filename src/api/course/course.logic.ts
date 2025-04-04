import { Injectable } from '@nestjs/common';
import { CourseDataService } from './course.data';
import { BatchDataService } from '../batch/batch.data';
import { CreateCourseRequestDto } from 'src/dto/course/course.dto';
import { TopicDataService } from './topic/topic.data';
import { ChapterDataService } from './chapter/chapter.data';
import { Types } from 'mongoose';
import { UpdateCourseRequestDto } from 'src/dto/course/course.dto';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';
import { CategoryDataService } from '../category/category.data';

@Injectable()
export class CourseLogicService {
  constructor(
    private courseDataService: CourseDataService,
    private topicDataService: TopicDataService,
    private chapterDataService: ChapterDataService,
    private batchDataService: BatchDataService,
    private categoryDataService: CategoryDataService,
  ) {}

  async createCourse(createCourseDto: CreateCourseRequestDto) {
    // Check if category exists
    const category = await this.categoryDataService.getCategoryById(
      createCourseDto.category,
    );

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

      let topicNumber = 1;
      // Create topics for each chapter
      for (const topicDto of chapterDto.topics) {
        await this.topicDataService.createTopic({
          ...topicDto,
          topicNumber,
          chapter: chapter._id,
        });

        topicNumber++;
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

  async updateCourse(
    updateCourseDto: UpdateCourseRequestDto & { courseId: string },
  ) {
    const { courseId, chapters, ...courseData } = updateCourseDto;

    // Update course basic information
    const updatedCourse = await this.courseDataService.updateCourse(
      courseId,
      courseData,
    );

    if (!updatedCourse) {
      throw new Error('Course not found');
    }

    // Update chapters if provided
    if (chapters) {
      // Get existing chapters
      const existingChapters =
        await this.chapterDataService.getChapters(courseId);

      for (const chapter of chapters) {
        if (chapter._id) {
          // Update existing chapter
          const updatedChapter = await this.chapterDataService.updateChapter(
            chapter._id.toString(),
            {
              ...chapter,
              course: courseId,
            },
          );
          if (!updatedChapter) throw new Error('Chapter not found');

          // Update or create topics
          if (chapter.topics) {
            let topicNumber = 1;
            for (const topic of chapter.topics) {
              if (topic._id) {
                // Update existing topic
                await this.topicDataService.updateTopic(topic._id.toString(), {
                  ...topic,
                  topicNumber,
                  chapter: updatedChapter._id,
                });
              } else {
                // Create new topic
                await this.topicDataService.createTopic({
                  ...topic,
                  topicNumber,
                  chapter: updatedChapter._id,
                });
              }
              topicNumber++;
            }
          }
        } else {
          // Create new chapter
          const newChapter = await this.chapterDataService.createChapter({
            ...chapter,
            course: courseId,
          });

          // Create topics for new chapter
          if (chapter.topics) {
            let topicNumber = 1;
            for (const topic of chapter.topics) {
              await this.topicDataService.createTopic({
                ...topic,
                topicNumber,
                chapter: newChapter._id,
              });
              topicNumber++;
            }
          }
        }
      }

      // Remove chapters that are not in the update request
      const updatedChapterIds = chapters
        .filter((chapter) => chapter._id)
        .map((chapter) => chapter._id?.toString())
        .filter((c) => !!c);

      for (const existingChapter of existingChapters) {
        if (!updatedChapterIds.includes(existingChapter._id.toString())) {
          await this.chapterDataService.deleteChapter(
            existingChapter._id.toString(),
          );
        }
      }
    }

    return { isSuccess: true };
  }

  async getCourseByCode(courseCode: string) {
    const course = await this.courseDataService.getCourseByCode(courseCode);
    if (!course) throw new CustomError(ERROR.COURSE_NOT_FOUND);

    const chapters = await this.chapterDataService.getChapters(
      course._id.toString(),
    );

    const category = await this.categoryDataService.getCategoryById(
      course.category.toString(),
    );

    const chaptersWithTopics = await Promise.all(
      chapters.map(async (chapter) => {
        const topics = await this.topicDataService.getTopics(
          chapter._id.toString(),
        );

        const formattedTopics = topics.map((topic) => ({
          ...topic,
          _id: topic._id.toString(),
        }));

        return {
          ...chapter,
          _id: chapter._id.toString(),
          topics: formattedTopics,
        };
      }),
    );

    return {
      ...course,
      category: category._id.toString(),
      categoryName: category.categoryName,
      chapters: chaptersWithTopics,
      faqs: [],
    };
  }
}
