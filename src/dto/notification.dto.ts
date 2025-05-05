export class CreateNotificationDto {
    message: string;
    type?: string;
    role: 'admin' | 'teacher' | 'student' | 'adminTeacher' | 'adminStudent' | 'teacherStudent';
    recipient?: string;
  }
  
  export class NotificationResponseDto {
    id: string;
    message: string;
    type?: string;
    role: string;
    read: boolean;
    createdAt: Date;
  }
  