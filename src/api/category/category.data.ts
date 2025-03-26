import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';

import { Category } from 'src/schemas/category.schema';

@Injectable()
export class CategoryDataService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async createCategory(input: Omit<Category, '_id'>) {
    const existingCategory = await this.categoryModel.findOne({
      categoryCode: input.categoryCode,
    });

    if (existingCategory) {
      throw new CustomError(ERROR.CATEGORY_ALREADY_EXISTS);
    }

    const newCategory = new this.categoryModel(input);
    return await newCategory.save();
  }

  async getCategory(input: { skip?: number; limit?: number } = {}) {
    const { skip = 0, limit = 0 } = input;

    return {
      data: await this.categoryModel
        .find()
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      count: await this.categoryModel.countDocuments(),
    };
  }

  async updateCategory(input: {
    categoryId: string;
    update?: Partial<Category>;
  }) {
    const { categoryId, update = {} } = input;

    const category = await this.categoryModel.findOneAndUpdate(
      {
        _id: categoryId,
      },
      { $set: update },
    );

    if (!category) throw new CustomError(ERROR.CATEGORY_ALREADY_EXISTS);

    return category;
  }
}
