// import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
// import { EnrollmentLogicService } from './enrollment.logic';
// import { CreateEnrollmentDto, UpdateEnrollmentDto, GetEnrollmentsResponseDTO } from '../../dto/enrollment.dto';
// import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from '../../common/guard/roles.guard';
// import { Roles } from '../../common/decorators/roles.decorator';
// import { User } from '../../common/decorators/user.decorator';

// @Controller('enrollments')
// export class EnrollmentController {
//   constructor(private enrollmentLogicService: EnrollmentLogicService) {}

//   @Get()
//   @UseGuards(AuthGuard('jwt'))
//   async getEnrollments(@User() user: any): Promise<GetEnrollmentsResponseDTO> {
//     return this.enrollmentLogicService.getEnrollments(user);
//   }

//   @Post()
//   @UseGuards(AuthGuard('jwt'), RolesGuard)
//   @Roles('admin')
//   async createEnrollment(@Body() createEnrollmentDto: CreateEnrollmentDto, @User() user: any) {
//     return this.enrollmentLogicService.createEnrollment(createEnrollmentDto, user);
//   }

//   @Get(':id')
//   @UseGuards(AuthGuard('jwt'))
//   async getEnrollmentById(@Param('id') id: string, @User() user: any) {
//     return this.enrollmentLogicService.getEnrollmentById(id, user);
//   }

//   @Put(':id')
//   @UseGuards(AuthGuard('jwt'), RolesGuard)
//   @Roles('admin')
//   async updateEnrollment(@Param('id') id: string, @Body() updateEnrollmentDto: UpdateEnrollmentDto, @User() user: any) {
//     return this.enrollmentLogicService.updateEnrollment(id, updateEnrollmentDto, user);
//   }

//   @Delete(':id')
//   @UseGuards(AuthGuard('jwt'), RolesGuard)
//   @Roles('admin')
//   async deleteEnrollment(@Param('id') id: string, @User() user: any) {
//     return this.enrollmentLogicService.deleteEnrollment(id, user);
//   }
// }

import { Controller, Get, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { EnrollmentLogicService } from './enrollment.logic';
import { EnrollmentResponseDTO, EnrollmentErrorDTO } from '../../dto/enrollment.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard } from '../../common/guard/user.guard';
import { IUser } from './enrollment.logic';

declare module 'express' {
  interface Request {
    user?: IUser;
  }
}

@Controller('enrollment')
export class EnrollmentController {
  constructor(private enrollmentLogicService: EnrollmentLogicService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), UserGuard)
  async getEnrollment(@Req() req: Request): Promise<EnrollmentResponseDTO | EnrollmentErrorDTO> {
    if (!req.user) throw new UnauthorizedException('No user authenticated');
    return this.enrollmentLogicService.getEnrollment(req.user);
  }
}