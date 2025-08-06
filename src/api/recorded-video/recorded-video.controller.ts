import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { RecordedVideoLogicService } from './recorded-video.logic';
import { CreateRecordedVideoDto, UpdateRecordedVideoDto, GetRecordedVideosResponseDTO } from '../../dto/recorded-video.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard } from '../../common/guard/user.guard';
import { USER_TYPES } from '../../common/constants/user.constants';
import { IUser } from './recorded-video.logic';

declare module 'express' {
  interface Request {
    user?: IUser;
  }
}

@Controller('recorded-videos')
export class RecordedVideoController {
  constructor(private recordedVideoLogicService: RecordedVideoLogicService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), UserGuard)
  async getVideos(@Req() req: Request): Promise<GetRecordedVideosResponseDTO> {
    if (!req.user) throw new UnauthorizedException('No user authenticated');
    console.log('User in getVideos:', req.user); // Debug log
    return this.recordedVideoLogicService.getVideos(req.user);
  }
  

  @Post()
  @UseGuards(AuthGuard('jwt'), UserGuard)
  async createVideo(@Body() createRecordedVideoDto: CreateRecordedVideoDto, @Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('No user authenticated');
    console.log('User in createVideo:', req.user); // Debug log
    return this.recordedVideoLogicService.createVideo(createRecordedVideoDto, req.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  async getVideoById(@Param('id') id: string, @Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('No user authenticated');
    console.log('User in getVideoById:', req.user); // Debug log
    return this.recordedVideoLogicService.getVideoById(id, req.user);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  async updateVideo(@Param('id') id: string, @Body() updateRecordedVideoDto: UpdateRecordedVideoDto, @Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('No user authenticated');
    console.log('User in updateVideo:', req.user); // Debug log
    return this.recordedVideoLogicService.updateVideo(id, updateRecordedVideoDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  async deleteVideo(@Param('id') id: string, @Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('No user authenticated');
    console.log('User in deleteVideo:', req.user); // Debug log
    return this.recordedVideoLogicService.deleteVideo(id, req.user);
  }
}