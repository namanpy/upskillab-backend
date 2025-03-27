import { Module } from '@nestjs/common';
import { BatchDataService } from './batch.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Batch, BatchSchema } from 'src/schemas/course/batch.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Batch.name, schema: BatchSchema }]),
  ],
  providers: [BatchDataService],
  controllers: [],
  exports: [BatchDataService],
})
export class BatchModule {}
