import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { GetTestimonialsResponseDTO } from '../../dto/testimonial.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryLogicService } from './category.logic';
import { ERROR } from 'src/common/constants/error.constants';

@Controller('category')
export class CategoryController {
  constructor(private categoryLogicService: CategoryLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get categories',
    type: GetTestimonialsResponseDTO,
  })
  @ApiResponse({
    status: ERROR.CATEGORY_ALREADY_EXISTS.code,
    description: ERROR.CATEGORY_ALREADY_EXISTS.message,
    example: ERROR.CATEGORY_ALREADY_EXISTS,
  })
  @Get('')
  async getCategory(
    @Query() skip: number,
    @Query() limit: number,
  ): Promise<GetTestimonialsResponseDTO> {}
}
