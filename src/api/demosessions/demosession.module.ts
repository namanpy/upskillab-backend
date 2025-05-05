import { Module } from '@nestjs/common';
import { DemoSessionController } from './demosession.controller';
import { DemoSessionLogicService } from './demosession.logic';
import { DemoSessionDataService } from './demosession.data';
import { MongooseModule } from '@nestjs/mongoose';
import { DemoSession, DemoSessionSchema } from '../../schemas/demosession.schema';
import { NotificationModule } from '../notification/notification.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: DemoSession.name, schema: DemoSessionSchema }]),
    NotificationModule,
  ],
  providers: [DemoSessionDataService, DemoSessionLogicService],
  controllers: [DemoSessionController],
  exports: [DemoSessionDataService],
})
export class DemoSessionModule {}