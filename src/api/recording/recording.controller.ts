// // src/recording/recording.controller.ts
// import { Controller, Get } from '@nestjs/common';
// import { RecordingService } from './recording.service';

// @Controller('recording')
// export class RecordingController {
//   constructor(private readonly recordingService: RecordingService) {}

//   @Get('latest')
//   async getLatestRecording() {
//     const teacherEmail = process.env.TEACHER_EMAIL;
//     if(teacherEmail){
//         return await this.recordingService.fetchLatestRecording(teacherEmail);
//     }
//     return null
//   }
// }
