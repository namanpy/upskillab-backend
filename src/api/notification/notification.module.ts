// src/modules/notification/notification.module.ts
import { Module } from '@nestjs/common';
import { NotificationLogicService } from './notification.logic';
import { NotificationDataService } from './notification.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from '../../schemas/notification.schema';
import { NotificationController } from './notification.controller'; // <-- ADD THIS
import { NotificationGateway } from './notification.gateway';
import { User,UserSchema } from 'src/schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema },
      {name:User.name,schema:UserSchema}
    ]),
  ],
  controllers: [NotificationController], // <-- ADD THIS LINE
  providers: [NotificationLogicService, NotificationDataService,NotificationGateway],
  exports: [NotificationLogicService],
})
export class NotificationModule {}
