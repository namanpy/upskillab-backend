import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from 'src/schemas/course/course.schema';
import { Category } from 'src/schemas/category.schema';

import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';

@Injectable()
export class CourseDataService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  async createCourse(input: Omit<Course, '_id'>) {
    const existingCourse = await this.courseModel.findOne({
      courseCode: input.courseCode,
    });

    if (existingCourse) {
      throw new CustomError(ERROR.COURSE_ALREADY_EXISTS);
    }

    const newCourse = new this.courseModel(input);
    return (await newCourse.save()).toObject();
  }

  async getCourse(input: { skip?: number; limit?: number } = {}) {
    const { skip = 0, limit = 0 } = input;

    return {
      data: await this.courseModel
        .find()
        .skip(skip)
        .populate<{
          category:
            | Category
            | (undefined extends Course['category'] ? undefined : never);
        }>({
          path: 'category',
        })
        .limit(limit)
        .lean()
        .exec(),
      count: await this.courseModel.countDocuments(),
    };
  }

  //   async updateCourse(input: { courseId: string; update?: Partial<Course> }) {
  //     const { courseId, update = {} } = input;

  //     if (update.courseCode) {
  //       const existingCourse = await this.courseModel.findOne({
  //         courseCode: update.courseCode,
  //       });

  //       if (existingCourse) {
  //         throw new CustomError(ERROR.COURSE_ALREADY_EXISTS);
  //       }
  //     }

  //     const course = await this.courseModel
  //       .findOneAndUpdate(
  //         {
  //           _id: courseId,
  //         },
  //         { $set: update },
  //       )
  //       .lean()
  //       .exec();

  //     if (!course) throw new CustomError(ERROR.COURSE_NOT_FOUND);

  //     return course;
  //   }
}
