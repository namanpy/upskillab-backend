import {
  Controller,
  Post,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { DoubtService } from './doubt.service';
import { CreateDoubtDto } from 'src/dto/doubtNew/create-doubt.dto';
import { CreateMessageDto } from 'src/dto/doubtNew/create-message.dto';

@Controller('/courseDoubts')
export class DoubtController {
  constructor(private readonly doubtService: DoubtService) {}

  @Post()
  createDoubt(@Body() dto: CreateDoubtDto) {
    return this.doubtService.createDoubt(dto);
  }
 
  @Post('/message')
  sendMessage(@Body() dto: CreateMessageDto) {
    return this.doubtService.addMessage(dto);
  }

  @Get('/user/:id')
  getUserDoubts(@Param('id') userId: string) {
    return this.doubtService.getUserDoubts(userId);
  }

  @Get('/:id/messages')
  getDoubtMessages(@Param('id') doubtId: string) {
    return this.doubtService.getDoubtMessages(doubtId);
  }
}
