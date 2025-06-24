import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReferralController } from './referral.controller';
import { ReferralLogicService } from './referral.logic';
import { ReferralDataService } from './referral.data';
import { Referral,ReferralSchema } from 'src/schemas/referral.schema';
import { ReferralSettingsService } from './referral.settings';
import { ReferralSettings,ReferralSettingsSchema } from 'src/schemas/referral-settings.schema';
import { ReferralSettingsController } from './referral-settings.controller';
@Module({
  imports: [MongooseModule.forFeature([
    { name: Referral.name, schema: ReferralSchema },
    { name: ReferralSettings.name, schema: ReferralSettingsSchema },
])],
  controllers: [ReferralController,ReferralSettingsController],
  providers: [ReferralLogicService, ReferralDataService, ReferralSettingsService],
  exports: [ReferralLogicService,ReferralDataService],
})
export class ReferralModule {}
