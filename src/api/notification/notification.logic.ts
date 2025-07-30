import { Injectable } from '@nestjs/common';
import { NotificationDataService } from './notification.data';
import { CreateNotificationDto } from '../../dto/notification.dto';
import { Notification } from '../../schemas/notification.schema';
import { NotificationGateway } from './notification.gateway';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class NotificationLogicService {
  constructor(
    private notificationDataService: NotificationDataService,
    private notificationGateway: NotificationGateway,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

//  async createNotification(dto: CreateNotificationDto): Promise<Notification> {
//     const notification = await this.notificationDataService.createNotification(dto);
    
//     // Emit notification to socket
//     if (dto.recipient) {
//       this.notificationGateway.sendToUser(dto.recipient, notification);
//     } else if (dto.role) {
//       this.notificationGateway.sendToRole(dto.role, notification);
//     }
//     return notification;
//   }


async createNotification(dto: CreateNotificationDto): Promise<any> {
    if (dto.recipient) {
      const notification = await this.notificationDataService.createNotification(dto);
      this.notificationGateway.sendToUser(dto.recipient, notification);
      return notification;
    }

    // 2. If role is provided → multi-user notification
    if (dto.role) {
      const roleMap = {
        admin: ['ADMIN'],
        teacher: ['TEACHER'],
        student: ['STUDENT'],
        adminTeacher: ['ADMIN', 'TEACHER'],
        adminStudent: ['ADMIN', 'STUDENT'],
        teacherStudent: ['TEACHER', 'STUDENT'],
      };

      const roles = roleMap[dto.role] || [];
      const users = await this.userModel.find({
        userType: { $in: roles },
        isActive: true,
      });

      const notifications: Notification[] = [];

      for (const user of users) {
        const notificationData: CreateNotificationDto = {
          message: dto.message,
          // type: dto.type,
          recipient: user._id.toString(),
        };

        const notification = await this.notificationDataService.createNotification(notificationData);
        notifications.push(notification);

        // Emit via socket
        this.notificationGateway.sendToUser(user._id.toString(), notification);
      }

      return {
        message: `Sent notification to ${notifications.length} users.`,
        notifications,
      };
    }

    throw new Error('Either recipient or role must be provided.');
  }

  async getNotificationsByUserId(userId: string) {

    const res = await this.notificationDataService.getNotificationsByUserId(userId);
    return res
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
