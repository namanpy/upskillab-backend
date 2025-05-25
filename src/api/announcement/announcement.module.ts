import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnnouncementController } from './announcement.controller';
import { Announcement, AnnouncementSchema } from 'src/schemas/announcement.schema';
import { AnnouncementService } from './announcement.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Announcement.name, schema: AnnouncementSchema }])
  ],
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
})
export class AnnouncementModule {}
