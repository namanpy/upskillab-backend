// import {
//   Body,
//   Controller,
//   Post,
//   Get,
//   Param,
//   UseGuards,
//   Request,
//   Query,
// } from '@nestjs/common';
// import {
//   CreateReferralDto,
//   ValidateReferralDto,
//   ApplyReferralResultDto,
// } from 'src/dto/referral.dto';
// import { ApiTags,ApiBearerAuth } from '@nestjs/swagger';
// import { ReferralLogicService } from './referral.logic';
// import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from 'src/common/guard/roles.guard';
// import { Roles } from 'src/common/decorators/roles.decorator';
// @ApiTags('referral')
// @Controller('referral')

// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'), RolesGuard)
// export class ReferralController {
//   constructor(private referralLogicService: ReferralLogicService) {}

//   @Post('generate')
//   @Roles('STUDENT')
//   async generateReferral(@Body() dto: CreateReferralDto, @Request() req) {
//     return this.referralLogicService.generateReferralCode(dto, req.user);
//   }

// //   @Patch('settings')
// // updateSettings(@Body() dto: { discountPercentage: number }) {
// //   return this.referralSettingsService.updateSettings(dto.discountPercentage);
// // }


// //   @Post('validate')
// //   async validateReferral(@Body() dto: ValidateReferralDto): Promise<ApplyReferralResultDto> {
// //     return this.referralLogicService.validateReferralCode(dto);
// //   }
// }


import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Request,
  UseGuards,
  Query,
  Patch,
  Req,
} from '@nestjs/common';
import { ReferralLogicService } from './referral.logic';
import {
  CreateReferralDto,
  ValidateReferralDto,
  ApplyReferralResultDto,
} from 'src/dto/referral.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('referral')
@Controller('referral')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReferralController {
  constructor(private referralLogicService: ReferralLogicService) {}

  @Post('generate')
  @Roles('STUDENT')
  async generateReferral(@Body() dto: CreateReferralDto, @Request() req) {
    return this.referralLogicService.generateReferralCode(dto, req.user);
  }

  @Get('my-referrals')
  @Roles('STUDENT')
  async getMyReferrals(@Request() req) {
    return this.referralLogicService.getReferralsByUser(req.user['_id']);
  }

  @Get('all')
  @Roles('ADMIN')
  async getAllReferrals() {
    return this.referralLogicService.getAllReferrals();
  }

  @Patch('update-status')
  @Roles('ADMIN')
  async updateReferredUserStatus(
    @Body() body: { referralCode: string; userId: string; courseId: string; status: 'pending' | 'completed' },
  ) {
    return this.referralLogicService.updateReferredUserStatus(
      body.referralCode,
      body.userId,
      body.courseId,
      body.status,
    );
  }
}
