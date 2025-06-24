import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SetReferralDiscountDto } from 'src/dto/referral-settings.dto';
import { ReferralSettingsService } from './referral.settings';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('referral-settings')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('referral-settings')
export class ReferralSettingsController {
  constructor(private referralSettingsService: ReferralSettingsService) {}

  @Post('set')
  @Roles('ADMIN')
  async setReferralDiscount(@Body() dto: SetReferralDiscountDto) {
    return this.referralSettingsService.updateSettings(dto?.discountPercentage, dto?.isActive);
  }

  @Get('all')
  @Roles('ADMIN')
  async getAllSettings() {
    return this.referralSettingsService.getAllSettings();
  }

  @Get('active')
  async getActiveSetting() {
    return this.referralSettingsService.getActiveSettings();
  }
}
