// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Body,
//   Param,
//   Query,
//   UseGuards,
// } from '@nestjs/common';
// import { TeacherLogicService } from './teacher.logic';
// import { CreateTeacherDto, GetTeacherRequestDTO } from '../../dto/teacher.dto';
// import { GetTeachersResponseDTO } from '../../dto/teacher.dto';
// import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
// import { AuthGuard } from '@nestjs/passport';

// @ApiTags('teachers')
// @Controller('teachers')
// export class TeacherController {
//   constructor(private teacherLogicService: TeacherLogicService) {}

//   @ApiResponse({
//     status: 200,
//     description: 'Get all teachers',
//     type: GetTeachersResponseDTO,
//   })
//   @Get('')
//   async getTeachers(
//     @Query() query: GetTeacherRequestDTO,
//   ): Promise<GetTeachersResponseDTO> {
//     return await this.teacherLogicService.getTeachers(query);
//   }

//   @ApiResponse({
//     status: 201,
//     description: 'Create a new teacher',
//   })
//   @Post('')
//   async createTeacher(@Body() createTeacherDto: CreateTeacherDto) {
//     return await this.teacherLogicService.createTeacher(createTeacherDto);
//   }

//   @ApiResponse({
//     status: 200,
//     description: 'Get a single teacher by ID',
//   })
//   @Get(':id')
//   async getTeacherById(@Param('id') id: string) {
//     return await this.teacherLogicService.getTeacherById(id);
//   }

//   @ApiResponse({
//     status: 200,
//     description: 'Update a teacher by ID',
//   })
//   @ApiBearerAuth()
//   @UseGuards(AuthGuard('jwt')) // Added JWT authentication
//   @Put(':id')
//   async updateTeacher(
//     @Param('id') id: string,
//     @Body() updateTeacherDto: Partial<CreateTeacherDto>,
//   ) {
//     return await this.teacherLogicService.updateTeacher(id, updateTeacherDto);
//   }
// }

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TeacherLogicService } from './teacher.logic';
import { CreateTeacherDto, GetTeacherRequestDTO, TeacherDetailsResponseDTO, UpdateTeacherDetailsDTO } from '../../dto/teacher.dto';
import { GetTeachersResponseDTO } from '../../dto/teacher.dto';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../common/decorators/user.decorator'; // Changed from GetUser to User
import { AllowUserType, UserGuard } from '../../common/guard/user.guard';
import { RolesGuard } from '../../common/guard/roles.guard';
import { USER_TYPES } from '../../common/constants/user.constants';
import { Roles } from '../../common/decorators/roles.decorator';
@ApiTags('teachers')
@Controller('teachers')
export class TeacherController {
  constructor(private teacherLogicService: TeacherLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all teachers',
    type: GetTeachersResponseDTO,
  })
  @Get('')
  async getTeachers(
    @Query() query: GetTeacherRequestDTO,
  ): Promise<GetTeachersResponseDTO> {
    return await this.teacherLogicService.getTeachers(query);
  }

  @ApiResponse({
    status: 201,
    description: 'Create a new teacher',
  })
  @Post('')
  async createTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    return await this.teacherLogicService.createTeacher(createTeacherDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Get authenticated teacher details',
    type: TeacherDetailsResponseDTO,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), UserGuard, RolesGuard)
  @AllowUserType(USER_TYPES.STUDENT) // Deny access to Student user type
  @Roles(USER_TYPES.TEACHER) // Allow access to Teacher user type via RolesGuard
  @Get('me')
  async getTeacherDetails(@User() user: any): Promise<TeacherDetailsResponseDTO> {
    return await this.teacherLogicService.getTeacherDetails(user);
  }

  @ApiResponse({
    status: 200,
    description: 'Update authenticated teacher details',
    type: TeacherDetailsResponseDTO,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), UserGuard, RolesGuard)
  @AllowUserType(USER_TYPES.STUDENT) // Deny access to Student user type
  @Roles(USER_TYPES.TEACHER) // Allow access to Teacher user type via RolesGuard
  @Patch('me')
  async updateTeacherDetails(
    @User() user: any,
    @Body() updateTeacherDto: UpdateTeacherDetailsDTO,
  ): Promise<TeacherDetailsResponseDTO> {
    return await this.teacherLogicService.updateTeacherDetails(user, updateTeacherDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Get a single teacher by ID',
  })
  @Get(':id')
  async getTeacherById(@Param('id') id: string) {
    return await this.teacherLogicService.getTeacherById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Update a teacher by ID',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateTeacher(
    @Param('id') id: string,
    @Body() updateTeacherDto: Partial<CreateTeacherDto>,
  ) {
    return await this.teacherLogicService.updateTeacher(id, updateTeacherDto);
  }
}