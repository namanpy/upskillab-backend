
import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ClassSessionLogicService } from './class-session.logic';
import { CreateClassSessionDto, UpdateClassSessionDto, GetClassSessionsResponseDTO } from '../../dto/class-session.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Class Schedule')
@Controller('class-schedule')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ClassSessionController {
  constructor(private classSessionLogicService: ClassSessionLogicService) {}

  @Get()
  @Roles('ADMIN')
  async getClassSessions(@Request() req) {
    return this.classSessionLogicService.getClassSessions(req.user);
  }

  @Get('student')
  @Roles('STUDENT')
  async getStudentClassSessions(@Request() req): Promise<GetClassSessionsResponseDTO> {
    console.log(req.user,"1")
    return this.classSessionLogicService.getStudentClassSessions(req.user);
  }
  // console.log()

  @Get('teacher')
  @Roles('TEACHER')
  async getTeacherClassSessions(@Request() req): Promise<GetClassSessionsResponseDTO> {
    return this.classSessionLogicService.getTeacherClassSessions(req.user);
  }

  @Post()
  @Roles('ADMIN')
  async createClassSession(@Body() createClassSessionDto: CreateClassSessionDto, @Request() req) {
    return this.classSessionLogicService.createClassSession(createClassSessionDto, req.user);
  }

  @Get(':id')
  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  async getClassSessionById(@Param('id') id: string, @Request() req) {
    return this.classSessionLogicService.getClassSessionById(id, req.user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TEACHER')
  async updateClassSession(@Param('id') id: string, @Body() updateClassSessionDto: UpdateClassSessionDto, @Request() req) {
    return this.classSessionLogicService.updateClassSession(id, updateClassSessionDto, req.user);
  }

  @Patch(':id/approve')
  @Roles('ADMIN')
  async approveClassSession(@Param('id') id: string, @Request() req) {
    return this.classSessionLogicService.approveClassSession(id, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteClassSession(@Param('id') id: string, @Request() req) {
    return this.classSessionLogicService.deleteClassSession(id, req.user);
  }
}