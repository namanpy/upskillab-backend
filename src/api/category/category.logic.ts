import { Injectable } from '@nestjs/common';
import { CategoryDataService } from './category.data';

@Injectable()
export class CategoryLogicService {
  constructor(private categoryDataService: CategoryDataService) {}

  async getCategory() {
    return {
      testimonials: await this.categoryDataService.getCategory(),
    };
  }
}
