import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LanguageLogicService } from './language.logic';
import {
  CreateLanguageRequestDto,
  CreateLanguageResponseDto,
  GetLanguagesRequestDto,
  GetLanguagesResponseDto,
  UpdateLanguageParamDto,
  UpdateLanguageRequestDto,
  UpdateLanguageResponseDto,
} from '../../dto/language.dto';
import { ERROR } from 'src/common/constants/error.constants';
import { Language } from 'src/schemas/language.schema';

@ApiTags('languages')
@Controller('languages')
export class LanguageController {
  constructor(private languageLogicService: LanguageLogicService) {}

  @Post()
  @ApiBody({ type: CreateLanguageRequestDto })
  @ApiResponse({
    status: 200,
    type: CreateLanguageResponseDto,
  })
  @ApiResponse({
    status: ERROR.LANGUAGE_ALREADY_EXISTS.code,
    description: ERROR.LANGUAGE_ALREADY_EXISTS.message,
  })
  async createLanguage(
    @Body() createLanguageDto: CreateLanguageRequestDto,
  ): Promise<CreateLanguageResponseDto> {
    return await this.languageLogicService.createLanguage(createLanguageDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: GetLanguagesResponseDto,
  })
  async getLanguages(
    @Query() query: GetLanguagesRequestDto,
  ): Promise<GetLanguagesResponseDto> {
    return await this.languageLogicService.getLanguages(query);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Language,
  })
  async getLanguageById(@Param('id') id: string) {
    return await this.languageLogicService.getLanguageById(id);
  }

  @Put(':languageId')
  @ApiBody({ type: UpdateLanguageRequestDto })
  @ApiResponse({
    status: 200,
    type: UpdateLanguageResponseDto,
  })
  async updateLanguage(
    @Param() param: UpdateLanguageParamDto,
    @Body() updateLanguageDto: UpdateLanguageRequestDto,
  ): Promise<UpdateLanguageResponseDto> {
    return await this.languageLogicService.updateLanguage(
      param.languageId,
      updateLanguageDto,
    );
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Language deleted successfully',
  })
  async deleteLanguage(@Param('id') id: string) {
    return await this.languageLogicService.deleteLanguage(id);
  }
}
