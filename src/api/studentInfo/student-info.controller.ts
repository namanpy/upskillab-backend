import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StudentInfoLogicService } from './student-info.logic';
import { StudentInfoResponseDTO } from '../../dto/student-info.dto';

@ApiTags('student-info')
@Controller('student-info')
@UseGuards(AuthGuard('jwt'))
export class StudentInfoController {
  constructor(private studentInfoLogicService: StudentInfoLogicService) {}

  @Get()
  @ApiOperation({ summary: 'Get student info (Student: own info, Admin: all students)' })
  @ApiResponse({ status: 200, description: 'Student info', type: StudentInfoResponseDTO })
  async getStudentInfo(@Req() req: any): Promise<StudentInfoResponseDTO> {
    return this.studentInfoLogicService.getStudentInfo(req.user);
  }
}