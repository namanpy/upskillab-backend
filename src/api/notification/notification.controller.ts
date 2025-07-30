import { Body, Controller, Get, Post, UseGuards, Req, Param, Patch, Delete } from '@nestjs/common';
import { NotificationLogicService } from './notification.logic';
import { CreateNotificationDto } from '../../dto/notification.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiTags,ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationController {
  constructor(private readonly notificationLogicService: NotificationLogicService) {}

//   @UseGuards(AuthGuard)
@ApiOperation({ summary: 'Create a new notification' })
@ApiBody({ type: CreateNotificationDto })
@ApiResponse({ status: 201, description: 'Notification created successfully' })
  @Post()
  async createNotification(@Body() dto: CreateNotificationDto) {
    return this.notificationLogicService.createNotification(dto);
  }

//   @UseGuards(AuthGuard)
@ApiOperation({ summary: 'Get notifications by user ID' })
@Get('user')
async getNotificationsForUserById(@Req() req: any) {
  return this.notificationLogicService.getNotificationsByUserId(req.user._id);
}

@ApiOperation({ summary: 'Get notifications by role' })
@ApiParam({ name: 'role', description: 'User role' })
@Get('role/:role')
async getNotificationsByRole(@Param('role') role: string) {
  return this.notificationLogicService.getNotificationsByRole(role);
}

@ApiOperation({ summary: 'Mark a notification as read' })
@ApiParam({ name: 'id', description: 'Notification ID' })
@Patch(':id/read')
async markNotificationRead(@Param('id') id: string) {
  return this.notificationLogicService.markNotificationAsRead(id);
}

@ApiOperation({ summary: 'Delete a notification' })
@ApiParam({ name: 'id', description: 'Notification ID' })
@Delete(':id')
async deleteNotification(@Param('id') id: string) {
  return this.notificationLogicService.deleteNotification(id);
}
}
