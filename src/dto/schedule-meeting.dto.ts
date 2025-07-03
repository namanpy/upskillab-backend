// src/schedule-meeting/dto/schedule-meeting.dto.ts
export class ScheduleMeetingDto {
  studentEmails: string[];
  date: string; // 'YYYY-MM-DD'
  time: string; // 'HH:mm'
  duration: number; // minutes
  topic: string;
  description: string;
  courseName: string;
  chapterName: string;
}
