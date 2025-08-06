export class ScheduleMeetingDto {
  summary: string;
  description: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  teacherEmail: string;
  studentEmails: string[];
}
