import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LiveClassesController } from './live-classes.controller';
import { LiveClassesLogicService } from './live-classes.logic';
import { LiveClassesDataService } from './live-classes.data';
import { ClassSessionSchema } from '../../schemas/class-session.schema';
import { AttendanceSchema } from '../../schemas/attendance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ClassSession', schema: ClassSessionSchema },
      { name: 'Attendance', schema: AttendanceSchema },
    ]),
  ],
  controllers: [LiveClassesController],
  providers: [LiveClassesLogicService, LiveClassesDataService],
})
export class LiveClassesModule {}