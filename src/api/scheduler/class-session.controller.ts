// import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
// import { ClassSessionLogicService } from './class-session.logic';
// import { CreateClassSessionDto, UpdateClassSessionDto, GetClassSessionsResponseDTO } from '../../dto/class-session.dto';
// import { ApiResponse, ApiTags } from '@nestjs/swagger';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { RolesGuard } from '../../common/guard/roles.guard';
// import { Roles } from '../../common/decorators/roles.decorator';
// import { AuthGuard } from '@nestjs/passport';

// @ApiTags('class-schedule')
// @Controller('class-schedule')
// @UseGuards(AuthGuard('jwt'))
// export class ClassSessionController {
//   constructor(private classSessionLogicService: ClassSessionLogicService) {}

//   @ApiResponse({ status: 200, description: 'Get all class sessions', type: GetClassSessionsResponseDTO })
//   @Get('')
//   @UseGuards(RolesGuard)
//   async getClassSessions(): Promise<GetClassSessionsResponseDTO> {
//     return await this.classSessionLogicService.getClassSessions();
//   }

//   @ApiResponse({ status: 201, description: 'Create a new class session' })
//   @Post('')
//   @UseGuards(RolesGuard)
//   @Roles('admin')
//   async createClassSession(@Body() createClassSessionDto: CreateClassSessionDto) {
//     return await this.classSessionLogicService.createClassSession(createClassSessionDto);
//   }

//   @ApiResponse({ status: 200, description: 'Get a single class session by ID' })
//   @Get(':id')
//   @UseGuards(RolesGuard)
//   async getClassSessionById(@Param('id') id: string) {
//     return await this.classSessionLogicService.getClassSessionById(id);
//   }

//   @ApiResponse({ status: 200, description: 'Update a class session by ID (fields optional)' })
//   @Put(':id')
//   @UseGuards(RolesGuard)
//   async updateClassSession(@Param('id') id: string, @Body() updateClassSessionDto: UpdateClassSessionDto) {
//     return await this.classSessionLogicService.updateClassSession(id, updateClassSessionDto);
//   }

//   @ApiResponse({ status: 200, description: 'Delete a class session by ID' })
//   @Delete(':id')
//   @UseGuards(RolesGuard)
//   @Roles('admin')
//   async deleteClassSession(@Param('id') id: string) {
//     return await this.classSessionLogicService.deleteClassSession(id);
//   }
// }


import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ClassSessionLogicService } from './class-session.logic';
import { CreateClassSessionDto, UpdateClassSessionDto, GetClassSessionsResponseDTO } from '../../dto/class-session.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../common/decorators/user.decorator';

@ApiTags('class-schedule')
@Controller('class-schedule')
@UseGuards(AuthGuard('jwt'))
export class ClassSessionController {
  constructor(private classSessionLogicService: ClassSessionLogicService) {}

  @ApiResponse({ status: 200, description: 'Get all class sessions', type: GetClassSessionsResponseDTO })
  @Get('')
  @UseGuards(RolesGuard)
  async getClassSessions(@User() user: any): Promise<GetClassSessionsResponseDTO> {
    return await this.classSessionLogicService.getClassSessions(user);
  }

  @ApiResponse({ status: 201, description: 'Create a new class session' })
  @Post('')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async createClassSession(@Body() createClassSessionDto: CreateClassSessionDto) {
    return await this.classSessionLogicService.createClassSession(createClassSessionDto);
  }

  @ApiResponse({ status: 200, description: 'Get a single class session by ID' })
  @Get(':id')
  @UseGuards(RolesGuard)
  async getClassSessionById(@Param('id') id: string, @User() user: any) {
    return await this.classSessionLogicService.getClassSessionById(id, user);
  }

  @ApiResponse({ status: 200, description: 'Update a class session by ID (fields optional)' })
  @Put(':id')
  @UseGuards(RolesGuard)
  async updateClassSession(@Param('id') id: string, @Body() updateClassSessionDto: UpdateClassSessionDto, @User() user: any) {
    return await this.classSessionLogicService.updateClassSession(id, updateClassSessionDto, user);
  }

  @ApiResponse({ status: 200, description: 'Delete a class session by ID' })
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async deleteClassSession(@Param('id') id: string) {
    return await this.classSessionLogicService.deleteClassSession(id);
  }
}