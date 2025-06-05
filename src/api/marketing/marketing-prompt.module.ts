import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketingPromptController } from './marketing-prompt.controller';
import { MarketingPromptService } from './marketing-prompt.service';
import { MarketingPrompt, MarketingPromptSchema } from '../../schemas/marketing-prompt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MarketingPrompt.name, schema: MarketingPromptSchema },
    ]),
  ],
  controllers: [MarketingPromptController],
  providers: [MarketingPromptService],
})
export class MarketingPromptModule {}