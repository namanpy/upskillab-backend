import { Controller, Get, Patch, Delete, Query, Param, Body, UseGuards } from '@nestjs/common';
import { AdminTeachersLogicService } from './admin-teachers.logic';
import { UpdateTeacherDto, GetTeachersRequestDto, GetTeachersResponseDto, TeacherResponseDto } from '../../../dto/admin/admin-teachers.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guard/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { USER_TYPES } from '../../../common/constants/user.constants';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('admin-teachers')
@ApiBearerAuth()
@Controller('admin/teachers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(USER_TYPES.ADMIN) // Only ADMIN role can access these endpoints
export class AdminTeachersController {
  constructor(private adminTeachersLogicService: AdminTeachersLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all teachers',
    type: GetTeachersResponseDto,
  })
  @Get()
  async getTeachers(
    @Query() query: GetTeachersRequestDto,
  ): Promise<GetTeachersResponseDto> {
    return this.adminTeachersLogicService.getTeachers(query);
  }

  @ApiResponse({
    status: 200,
    description: 'Update a teacher by ID',
    type: TeacherResponseDto,
  })
  @Patch(':id')
  async updateTeacher(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherResponseDto> {
    return this.adminTeachersLogicService.updateTeacher(id, updateTeacherDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete a teacher by ID',
  })
  @Delete(':id')
  async deleteTeacher(@Param('id') id: string): Promise<{ message: string }> {
    return this.adminTeachersLogicService.deleteTeacher(id);
  }
}