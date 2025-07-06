// // src/schedule-meeting/schedule-meeting.controller.ts
// import { Controller, Post, Body } from '@nestjs/common';
// import { ScheduleMeetingService } from './schedule-meeting.service';
// import { ScheduleMeetingDto } from 'src/dto/schedule-meeting.dto';
// // import { ScheduleMeetingDto } from './dto/schedule-meeting.dto';
// @Controller('meetings')
// export class ScheduleMeetingController {
//   constructor(private readonly service: ScheduleMeetingService) {}

//   @Post('schedule')
//   async scheduleMeeting(@Body() dto: ScheduleMeetingDto) {
//     const teacherEmail = process.env?.TEACHER_EMAIL;
//     if(teacherEmail){
//         return await this.service.createMeeting(dto, teacherEmail);
//     }
//     return false
//   }
// }
