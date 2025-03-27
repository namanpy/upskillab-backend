import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryLogicService } from './category.logic';
import { CategoryDataService } from './category.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [CategoryDataService, CategoryLogicService],
  controllers: [CategoryController],
  exports: [CategoryDataService],
})
export class CategoryModule {}
