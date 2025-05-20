import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { LiveClassesLogicService } from './live-classes.logic';
import {
  LiveClassesResponseDto,
  LiveClassResponseDto,
  MarkAttendanceDto,
  MarkAttendanceResponseDto,
  UserAttendanceResponseDto,
} from '../../dto/live-classes.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../../common/decorators/user.decorator';
import { UserDocument } from '../../schemas/user.schema';
import { Types } from 'mongoose';

@ApiTags('live-classes')
@Controller('live-classes')
export class LiveClassesController {
  constructor(private liveClassesLogicService: LiveClassesLogicService) {}

  // @ApiResponse({
  //   status: 200,
  //   description: 'Get all live classes',
  //   type: LiveClassesResponseDto,
  // })
  // @Get()
  // @UseGuards(AuthGuard('jwt'))
  // async getLiveClasses(@Request() req): Promise<LiveClassesResponseDto> {
  //   return this.liveClassesLogicService.getLiveClasses(req.user._id.toString());
  // }

  // @ApiResponse({
  //   status: 200,
  //   description: 'Get user attendance history',
  //   type: UserAttendanceResponseDto,
  // })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('attendance')
  async getUserAttendance(
    @User() user: UserDocument,
  ): Promise<UserAttendanceResponseDto> {
    console.log('getUserAttendance: User ID:', user._id.toString());

    return this.liveClassesLogicService.getUserAttendance(user);
  }

  @ApiResponse({
    status: 200,
    description: 'Get a live class by ID',
    type: LiveClassResponseDto,
  })
  @Get(':classId')
  @UseGuards(AuthGuard('jwt'))
  async getLiveClassById(
    @Param('classId') classId: string,
    @Request() req,
  ): Promise<LiveClassResponseDto> {
    console.log('getLiveClassById: Class ID:', classId);
    if (!Types.ObjectId.isValid(classId)) {
      throw new BadRequestException('Invalid class ID');
    }
    return this.liveClassesLogicService.getLiveClassById(
      classId,
      req.user._id.toString(),
    );
  }

  @ApiResponse({
    status: 201,
    description: 'Mark attendance for a live class',
    type: MarkAttendanceResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':classId/attendance')
  async markAttendance(
    @Param('classId') classId: string,
    @User() user: UserDocument,
    @Body() markAttendanceDto: MarkAttendanceDto,
  ): Promise<MarkAttendanceResponseDto> {
    console.log(
      'markAttendance: Class ID:',
      classId,
      'User ID:',
      user._id.toString(),
    );
    if (!Types.ObjectId.isValid(classId)) {
      throw new BadRequestException('Invalid class ID');
    }
    return this.liveClassesLogicService.markAttendance(
      classId,
      user._id.toString(),
      markAttendanceDto,
    );
  }
}
