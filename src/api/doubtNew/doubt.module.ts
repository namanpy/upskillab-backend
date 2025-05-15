import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Doubt, DoubtSchema } from 'src/schemas/doubtNew/doubt.schema';
import { Message, MessageSchema } from 'src/schemas/doubtNew/doubt-message.schema';
import { DoubtService } from './doubt.service';
import { DoubtController } from './doubt.controller';
import { DoubtGateway } from './doubt.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Doubt.name, schema: DoubtSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [DoubtController],
  providers: [DoubtService, DoubtGateway],
})
export class DoubtModule {}
