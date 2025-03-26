import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CategoryLogicService } from './category.logic';
import { ERROR } from 'src/common/constants/error.constants';

import {
  CreateCategoryRequestDto,
  CreateCategoryResponseDto,
  GetCategoryRequestDto,
  GetCategoryResponseDto,
  UpdateCategoryRequestBodyDto,
  UpdateCategoryRequestParamsDto,
  UpdateCategoryResponseDto,
} from 'src/dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryLogicService: CategoryLogicService) {}

  @ApiBody({
    type: CreateCategoryRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Create category',
    type: CreateCategoryResponseDto,
  })
  @ApiResponse({
    status: ERROR.CATEGORY_ALREADY_EXISTS.code,
    description: ERROR.CATEGORY_ALREADY_EXISTS.message,
    example: ERROR.CATEGORY_ALREADY_EXISTS,
  })
  @Post('')
  async createCategory(
    @Body() body: CreateCategoryRequestDto,
  ): Promise<CreateCategoryResponseDto> {
    return await this.categoryLogicService.createCategory(body);
  }

  @ApiQuery({
    type: GetCategoryRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Get categories',
    type: GetCategoryResponseDto,
  })
  @Get('')
  async getCategory(
    @Query() query: GetCategoryRequestDto,
  ): Promise<GetCategoryResponseDto> {
    return await this.categoryLogicService.getCategory(query);
  }

  @ApiBody({
    type: UpdateCategoryRequestBodyDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Update category',
    type: UpdateCategoryResponseDto,
  })
  @ApiResponse({
    status: ERROR.CATEGORY_NOT_FOUND.code,
    description: ERROR.CATEGORY_NOT_FOUND.message,
    example: ERROR.CATEGORY_NOT_FOUND,
  })
  @ApiResponse({
    status: ERROR.CATEGORY_ALREADY_EXISTS.code,
    description: ERROR.CATEGORY_ALREADY_EXISTS.message,
    example: ERROR.CATEGORY_ALREADY_EXISTS,
  })
  @Put(':categoryId')
  async updateCategory(
    @Param() param: UpdateCategoryRequestParamsDto,
    @Body() body: UpdateCategoryRequestBodyDto,
  ): Promise<UpdateCategoryResponseDto> {
    return await this.categoryLogicService.updateCategory({
      ...param,
      ...body,
    });
  }
}
