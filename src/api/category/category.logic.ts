import { Injectable } from '@nestjs/common';
import { CategoryDataService } from './category.data';
import { Category } from 'src/schemas/category.schema';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';

@Injectable()
export class CategoryLogicService {
  constructor(private categoryDataService: CategoryDataService) {}

  async createCategory(input: Omit<Category, '_id'>) {
    await this.categoryDataService.createCategory(input);

    return {
      isSuccess: true,
    };
  }

  async getCategory(input: {
    featured?: boolean;
    skip?: number;
    limit?: number;
  }) {
    const { data, count } = await this.categoryDataService.getCategory(input);

    return {
      data,
      count,
    };
  }

  async updateCategory(
    input: {
      categoryId: string;
    } & Omit<Category, '_id'>,
  ) {
    const { categoryId, ...update } = input;
    await this.categoryDataService.updateCategory({
      categoryId,
      update,
    });

    return {
      isSuccess: true,
    };
  }

  async getCategoryByCode(categoryCode: string) {
    const category =
      await this.categoryDataService.getCategoryByCode(categoryCode);
    if (!category) throw new CustomError(ERROR.CATEGORY_NOT_FOUND);

    return { ...category, _id: category._id.toString() };
  }
}
