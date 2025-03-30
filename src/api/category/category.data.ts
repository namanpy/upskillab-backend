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
    return (await newCategory.save()).toObject();
  }

  async getCategory(
    input: {
      searchString?: string;
      featured?: boolean;
      skip?: number;
      limit?: number;
    } = {},
  ) {
    const { searchString, featured, skip = 0, limit = 0 } = input;

    const filter = {
      ...(searchString && {
        categoryName: { $regex: searchString, $options: 'i' },
      }),
      ...(featured && { featured }),
    };

    return {
      data: await this.categoryModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      count: await this.categoryModel.countDocuments(filter),
    };
  }

  async updateCategory(input: {
    categoryId: string;
    update?: Partial<Category>;
  }) {
    const { categoryId, update = {} } = input;

    if (update.categoryCode) {
      const existingCategory = await this.categoryModel.findOne({
        categoryCode: update.categoryCode,
      });

      if (existingCategory) {
        throw new CustomError(ERROR.CATEGORY_ALREADY_EXISTS);
      }
    }

    const category = await this.categoryModel
      .findOneAndUpdate(
        {
          _id: categoryId,
        },
        { $set: update },
      )
      .lean()
      .exec();

    if (!category) throw new CustomError(ERROR.CATEGORY_NOT_FOUND);

    return category;
  }
}
