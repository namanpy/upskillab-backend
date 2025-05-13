import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationGateway');

  // Map: socketId -> { userId, roles: string[] }
  private connectedUsers = new Map<string, { userId: string; roles: string[] }>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('register')
 handleRegister(client: Socket, payload: { userId: string; roles: string[] | string }) {
  const rolesArray = Array.isArray(payload.roles)
    ? payload.roles
    : payload.roles?.split('+') || [];

  this.logger.log(`Registering client ${client.id} as user ${payload.userId} with roles ${rolesArray}`);

  this.connectedUsers.set(client.id, {
    userId: payload.userId,
    roles: rolesArray,
  });
}

  // Emit to specific user
  sendToUser(userId: string, notification: any) {
    for (const [socketId, user] of this.connectedUsers.entries()) {
      if (user.userId === userId) {
        this.server.to(socketId).emit('notification', notification);
      }
    }
  }

  // Emit to specific role
  sendToRole(role: string, notification: any) {
    for (const [socketId, user] of this.connectedUsers.entries()) {
      console.log(user,role)
      if (user.roles.includes(role)) {
        this.server.to(socketId).emit('notification', notification);
      }
    }
  }

  // Emit to multiple roles
  sendToRoles(roles: string[], notification: any) {
    for (const [socketId, user] of this.connectedUsers.entries()) {
      if (user.roles.some(r => roles.includes(r))) {
        this.server.to(socketId).emit('notification', notification);
      }
    }
  }
}
