import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Language, LanguageSchema } from '../../schemas/language.schema';
import { LanguageController } from './language.controller';
import { LanguageLogicService } from './language.logic';
import { LanguageDataService } from './language.data';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Language.name, schema: LanguageSchema },
    ]),
  ],
  controllers: [LanguageController],
  providers: [LanguageLogicService, LanguageDataService],
  exports: [LanguageDataService],
})
export class LanguageModule {}
