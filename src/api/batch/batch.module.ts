import { Module } from '@nestjs/common';
import { BatchDataService } from './batch.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Batch, BatchSchema } from 'src/schemas/course/batch.schema';
import { BatchLogicService } from './batch.logic';
import { BatchController } from './batch.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Batch.name, schema: BatchSchema }]),
  ],
  providers: [BatchDataService, BatchLogicService, BatchDataService],
  controllers: [BatchController],
  exports: [BatchDataService],
})
export class BatchModule {}
