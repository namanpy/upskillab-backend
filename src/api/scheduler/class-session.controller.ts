// import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
// import { ClassSessionLogicService } from './class-session.logic';
// import { CreateClassSessionDto, UpdateClassSessionDto, GetClassSessionsResponseDTO } from '../../dto/class-session.dto';
// import { ApiResponse, ApiTags } from '@nestjs/swagger';
// import { RolesGuard } from '../../common/guard/roles.guard';
// import { Roles } from '../../common/decorators/roles.decorator';
// import { AuthGuard } from '@nestjs/passport';
// import { User } from '../../common/decorators/user.decorator';

// @ApiTags('class-schedule')
// @Controller('class-schedule')
// @UseGuards(AuthGuard('jwt'))
// export class ClassSessionController {
//   constructor(private classSessionLogicService: ClassSessionLogicService) {}

//   @ApiResponse({ status: 200, description: 'Get all class sessions', type: GetClassSessionsResponseDTO })
//   @Get('')
//   @UseGuards(RolesGuard)
//   async getClassSessions(@User() user: any): Promise<GetClassSessionsResponseDTO> {
//     return await this.classSessionLogicService.getClassSessions(user);
//   }

//   @ApiResponse({ status: 201, description: 'Create a new class session' })
//   @Post('')
//   @UseGuards(RolesGuard)
//   @Roles('ADMIN')
//   async createClassSession(@Body() createClassSessionDto: CreateClassSessionDto) {
//     return await this.classSessionLogicService.createClassSession(createClassSessionDto);
//   }

//   @ApiResponse({ status: 200, description: 'Get a single class session by ID' })
//   @Get(':id')
//   @UseGuards(RolesGuard)
//   async getClassSessionById(@Param('id') id: string, @User() user: any) {
//     return await this.classSessionLogicService.getClassSessionById(id, user);
//   }

//   @ApiResponse({ status: 200, description: 'Update a class session by ID (fields optional)' })
//   @Put(':id')
//   @UseGuards(RolesGuard)
//   async updateClassSession(@Param('id') id: string, @Body() updateClassSessionDto: UpdateClassSessionDto, @User() user: any) {
//     return await this.classSessionLogicService.updateClassSession(id, updateClassSessionDto, user);
//   }

//   @ApiResponse({ status: 200, description: 'Delete a class session by ID' })
//   @Delete(':id')
//   @UseGuards(RolesGuard)
//   @Roles('ADMIN')
//   async deleteClassSession(@Param('id') id: string) {
//     return await this.classSessionLogicService.deleteClassSession(id);
//   }
// }


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
  async getClassSessions(@Request() req): Promise<GetClassSessionsResponseDTO> {
    return this.classSessionLogicService.getClassSessions(req.user);
  }

  @Get('STUDENT')
  @Roles('STUDENT')
  async getStudentClassSessions(@Request() req): Promise<GetClassSessionsResponseDTO> {
    return this.classSessionLogicService.getStudentClassSessions(req.user);
  }

  @Get('TEACHER')
  @Roles('TEACHER')
  async getTeacherClassSessions(@Request() req): Promise<GetClassSessionsResponseDTO> {
    return this.classSessionLogicService.getTeacherClassSessions(req.user);
  }

  @Post()
  @Roles('ADMIN')
  async createClassSession(@Body() createClassSessionDto: CreateClassSessionDto, @Request() req) {
    return this.classSessionLogicService.createClassSession(createClassSessionDto, req.user);
  }

  @Post('TEACHER')
  @Roles('TEACHER')
  async createTeacherClassSession(@Body() createClassSessionDto: CreateClassSessionDto, @Request() req) {
    return this.classSessionLogicService.createTeacherClassSession(createClassSessionDto, req.user);
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