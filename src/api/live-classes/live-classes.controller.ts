import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { LiveClassesLogicService } from './live-classes.logic';
import { LiveClassesResponseDto, LiveClassResponseDto, MarkAttendanceDto, MarkAttendanceResponseDto } from '../../dto/live-classes.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
// import { User } from '../../common/decorators/get-user.decorator';
import { User } from '../../common/decorators/user.decorator';
import { UserDocument } from '../../schemas/user.schema';

@ApiTags('live-classes')
@Controller('live-classes')
export class LiveClassesController {
  constructor(private liveClassesLogicService: LiveClassesLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all live classes',
    type: LiveClassesResponseDto,
  })
  @Get()
  async getLiveClasses(): Promise<LiveClassesResponseDto> {
    return this.liveClassesLogicService.getLiveClasses();
  }

  @ApiResponse({
    status: 200,
    description: 'Get a live class by ID',
    type: LiveClassResponseDto,
  })
  @Get(':classId')
  async getLiveClassById(@Param('classId') classId: string): Promise<LiveClassResponseDto> {
    return this.liveClassesLogicService.getLiveClassById(classId);
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
    return this.liveClassesLogicService.markAttendance(
      classId,
      user._id.toString(),
      markAttendanceDto,
    );
  }
}