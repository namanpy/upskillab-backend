import { Injectable } from '@nestjs/common';
import { NotificationDataService } from './notification.data';
import { CreateNotificationDto } from '../../dto/notification.dto';
import { Notification } from '../../schemas/notification.schema';

@Injectable()
export class NotificationLogicService {
  constructor(
    private notificationDataService: NotificationDataService,
  ) {}

  async createNotification(dto: CreateNotificationDto): Promise<Notification> {
    return this.notificationDataService.createNotification(dto);
  }

//   async getNotificationsForUser(user: any): Promise<Notification[]> {
//     if (user.role) {
//       return this.notificationDataService.getNotificationsByRole(user.role);
//     }
//     return [];
//   }

  async getNotificationsByUserId(userId: string) {
    return this.notificationDataService.getNotificationsByUserId(userId);
  }
  
  async getNotificationsByRole(role: string) {
    return this.notificationDataService.getNotificationsByRole(role);
  }
  
  async markNotificationAsRead(id: string) {
    return this.notificationDataService.markAsRead(id);
  }
  
  async deleteNotification(id: string) {
    return this.notificationDataService.deleteNotification(id);
  }
  
}
