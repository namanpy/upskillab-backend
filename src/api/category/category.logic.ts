import { Injectable } from '@nestjs/common';
import { CategoryDataService } from './category.data';
import { Category } from 'src/schemas/category.schema';

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
}
