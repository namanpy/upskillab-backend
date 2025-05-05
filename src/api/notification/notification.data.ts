import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from '../../schemas/notification.schema';
import { Model } from 'mongoose';
import { CreateNotificationDto } from '../../dto/notification.dto';

@Injectable()
export class NotificationDataService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async createNotification(dto: CreateNotificationDto) {
    return this.notificationModel.create(dto);
  }

  async getNotificationsByRole(role: string) {
    return this.notificationModel.find({ role });
  }

  async getNotificationsByRecipient(userId: string) {
    return this.notificationModel.find({ recipient: userId });
  }

  async markAsRead(id: string) {
    return this.notificationModel.findByIdAndUpdate(id, { read: true }, { new: true });
  }

  async getNotificationsByUserId(userId: string) {
    return this.notificationModel.find({ recipient: userId });
  }
  
  async deleteNotification(id: string) {
    return this.notificationModel.findByIdAndDelete(id);
  }
  
}
