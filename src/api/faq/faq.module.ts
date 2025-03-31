import { Module } from '@nestjs/common';
import { FAQController } from './faq.controller';
import { FAQLogicService } from './faq.logic';
import { FAQDataService } from './faq.data';
import { MongooseModule } from '@nestjs/mongoose';
import { FAQ, FAQSchema } from '../../schemas/home/faq.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FAQ.name, schema: FAQSchema }]),
  ],
  providers: [FAQDataService, FAQLogicService],
  controllers: [FAQController],
  exports: [FAQDataService],
})
export class FAQModule {}