import { Module } from '@nestjs/common';
import { HiringPartnerController } from './hiring-partner.controller';
import { HiringPartnerLogicService } from './hiring-partner.logic';
import { HiringPartnerDataService } from './hiring-partner.data';
import { MongooseModule } from '@nestjs/mongoose';
import { HiringPartner, HiringPartnerSchema } from '../../../schemas/home/hiring-partner.schema';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: HiringPartner.name, schema: HiringPartnerSchema }]),
  ],
  providers: [HiringPartnerDataService, HiringPartnerLogicService, ImageUploaderService],
  controllers: [HiringPartnerController],
})
export class HiringPartnerModule {}