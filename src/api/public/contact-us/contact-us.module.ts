import { Module } from '@nestjs/common';
import { ContactUsController } from './contact-us.controller';
import { ContactUsLogicService } from './contact-us.logic';
import { ContactUsDataService } from './contact-us.data';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactUs, ContactUsSchema } from '../../../schemas/home/contact-us.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ContactUs.name, schema: ContactUsSchema }]),
  ],
  providers: [ContactUsDataService, ContactUsLogicService],
  controllers: [ContactUsController],
})
export class ContactUsModule {}