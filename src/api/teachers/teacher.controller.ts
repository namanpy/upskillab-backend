import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { TeacherLogicService } from './teacher.logic';
import { CreateTeacherDto, GetTeacherRequestDTO } from '../../dto/teacher.dto';
import { GetTeachersResponseDTO } from '../../dto/teacher.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

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
  @Put(':id')
  async updateTeacher(
    @Param('id') id: string,
    @Body() updateTeacherDto: Partial<CreateTeacherDto>,
  ) {
    return await this.teacherLogicService.updateTeacher(id, updateTeacherDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete a teacher by ID',
  })
  @Delete(':id')
  async deleteTeacher(@Param('id') id: string) {
    return await this.teacherLogicService.deleteTeacher(id);
  }
}
