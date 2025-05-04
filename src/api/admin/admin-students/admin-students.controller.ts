import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AdminStudentsLogicService } from './admin-students.logic';
import { StudentsResponseDto, UpdateStudentDto, StudentResponseDto, DeleteStudentResponseDto } from './admin-students.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../../common/guard/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { USER_TYPES } from '../../../common/constants/user.constants';

@ApiTags('admin/students')
@Controller('admin/students')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminStudentsController {
  constructor(private adminStudentsLogicService: AdminStudentsLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all students',
    type: StudentsResponseDto,
  })
  @ApiBearerAuth()
  @Roles(USER_TYPES.ADMIN)
  @Get()
  async getStudents(): Promise<StudentsResponseDto> {
    return this.adminStudentsLogicService.getStudents();
  }

  @ApiResponse({
    status: 200,
    description: 'Update a student',
    type: StudentResponseDto,
  })
  @ApiBearerAuth()
  @Roles(USER_TYPES.ADMIN)
  @Patch(':studentId')
  async updateStudent(
    @Param('studentId') studentId: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.adminStudentsLogicService.updateStudent(studentId, updateStudentDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete a student',
    type: DeleteStudentResponseDto,
  })
  @ApiBearerAuth()
  @Roles(USER_TYPES.ADMIN)
  @Delete(':studentId')
  async deleteStudent(
    @Param('studentId') studentId: string,
  ): Promise<DeleteStudentResponseDto> {
    return this.adminStudentsLogicService.deleteStudent(studentId);
  }
}