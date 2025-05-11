import { Controller, Get, Patch, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { StudentLogicService } from './student.logic';
import { StudentDTO, UpdateStudentDTO } from '../../dto/student.dto';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../common/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { USER_TYPES } from '../../common/constants/user.constants';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guard/roles.guard';

@ApiTags('students')
@Controller('students')
export class StudentController {
  constructor(private studentLogicService: StudentLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get authenticated student details',
    type: StudentDTO,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.STUDENT)
  @Get('me')
  async getStudentDetails(@User() user: any): Promise<StudentDTO> {
    return await this.studentLogicService.getStudentDetails(user);
  }

  @ApiResponse({
    status: 200,
    description: 'Update authenticated student details',
    type: StudentDTO,
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.STUDENT)
  @UseInterceptors(FileInterceptor('image'))
  @Patch('me')
  async updateStudentDetails(
    @User() user: any,
    @Body() updateStudentDto: UpdateStudentDTO,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<StudentDTO> {
    return await this.studentLogicService.updateStudentDetails(user, updateStudentDto, file);
  }
}