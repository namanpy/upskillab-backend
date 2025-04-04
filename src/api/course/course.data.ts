import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model, SortOrder } from 'mongoose';
import { Course } from 'src/schemas/course/course.schema';
import { Category } from 'src/schemas/category.schema';

import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';
import { GetCourseDisplayRequestDto } from 'src/dto/course/course.dto';
import { StringifyObjectId } from 'src/common/types/common.types';

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

  async getCourse(input: GetCourseDisplayRequestDto = {}) {
    const { skip = 0, limit = 0, sort = [], categoryIds = [], search } = input;

    // Build query
    const query = this.courseModel.find();

    // Apply search if provided
    if (search) {
      query.or([
        { courseName: { $regex: search, $options: 'i' } },
        { courseCode: { $regex: search, $options: 'i' } },
      ]);
    }

    // Apply category filter if provided
    if (categoryIds.length > 0) {
      query.where('category').in(categoryIds);
    }

    // Apply multiple sort fields if provided
    if (sort.length > 0) {
      const sortConfig = sort.reduce(
        (acc, { field, order }) => {
          acc[field] = order;
          return acc;
        },
        {} as Record<string, SortOrder>,
      );
      query.sort(sortConfig);
    }

    return {
      data: await query
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
      count: await this.courseModel.countDocuments(
        categoryIds.length > 0 ? { category: { $in: categoryIds } } : {},
      ),
    };
  }

  async updateCourse(
    courseId: string,
    updateData: Partial<StringifyObjectId<Course>>,
  ): Promise<Course | null> {
    // Convert string ID to ObjectId if category is being updated
    if (updateData.category && typeof updateData.category === 'string') {
      updateData.category = Types.ObjectId.createFromHexString(
        updateData.category,
      );
    }

    return this.courseModel
      .findByIdAndUpdate(courseId, updateData, { new: true })
      .lean()
      .exec();
  }

  getCourseByCode(courseCode: string) {
    return this.courseModel.findOne({ courseCode }).lean().exec();
  }
}
