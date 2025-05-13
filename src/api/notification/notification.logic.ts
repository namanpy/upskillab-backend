import { Injectable } from '@nestjs/common';
import { NotificationDataService } from './notification.data';
import { CreateNotificationDto } from '../../dto/notification.dto';
import { Notification } from '../../schemas/notification.schema';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationLogicService {
  constructor(
    private notificationDataService: NotificationDataService,
    private notificationGateway: NotificationGateway,
  ) {}

 async createNotification(dto: CreateNotificationDto): Promise<Notification> {
    const notification = await this.notificationDataService.createNotification(dto);
    
    // Emit notification to socket
    if (dto.recipient) {
      this.notificationGateway.sendToUser(dto.recipient, notification);
    } else if (dto.role) {
      this.notificationGateway.sendToRole(dto.role, notification);
    }
    return notification;
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
