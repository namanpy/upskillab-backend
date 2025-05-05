// src/modules/notification/notification.module.ts
import { Module } from '@nestjs/common';
import { NotificationLogicService } from './notification.logic';
import { NotificationDataService } from './notification.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from '../../schemas/notification.schema';
import { NotificationController } from './notification.controller'; // <-- ADD THIS

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
  ],
  controllers: [NotificationController], // <-- ADD THIS LINE
  providers: [NotificationLogicService, NotificationDataService],
  exports: [NotificationLogicService],
})
export class NotificationModule {}
