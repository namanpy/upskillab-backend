import { Module } from '@nestjs/common';
import { BatchDataService, BatchRepository } from './batch.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Batch, BatchSchema } from 'src/schemas/course/batch.schema';
import { BatchService } from './batch.logic';
import { BatchController } from './batch.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Batch.name, schema: BatchSchema }]),
  ],
  providers: [BatchDataService, BatchService, BatchRepository],
  controllers: [BatchController],
  exports: [BatchDataService],
})
export class BatchModule {}
