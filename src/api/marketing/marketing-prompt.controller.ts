import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MarketingPromptService } from './marketing-prompt.service';
import {
  CreateMarketingPromptDTO,
  UpdateMarketingPromptDTO,
  MarketingPromptResponseDTO,
} from '../../dto/marketing-prompt.dto';
import { ApiTags, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { USER_TYPES } from '../../common/constants/user.constants';

@ApiTags('marketing-prompt')
@Controller('api/marketing-prompt')
export class MarketingPromptController {
  constructor(private readonly marketingPromptService: MarketingPromptService) {}

  @Post('admin')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.ADMIN)
  @ApiBody({ type: CreateMarketingPromptDTO })
  @ApiResponse({ status: 201, description: 'Marketing prompt created', type: MarketingPromptResponseDTO })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createMarketingPrompt(
    @Body() createMarketingPromptDTO: CreateMarketingPromptDTO,
  ): Promise<MarketingPromptResponseDTO> {
    return await this.marketingPromptService.createMarketingPrompt(createMarketingPromptDTO);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of active marketing prompts',
    type: [MarketingPromptResponseDTO],
  })
  async getActiveMarketingPrompts(): Promise<MarketingPromptResponseDTO[]> {
    return await this.marketingPromptService.getActiveMarketingPrompts();
  }

  @Get('admin')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'List of all marketing prompts (active and inactive)',
    type: [MarketingPromptResponseDTO],
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAllMarketingPrompts(): Promise<MarketingPromptResponseDTO[]> {
    return await this.marketingPromptService.getAllMarketingPrompts();
  }

  @Patch('admin/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.ADMIN)
  @ApiBody({ type: UpdateMarketingPromptDTO })
  @ApiResponse({ status: 200, description: 'Marketing prompt updated', type: MarketingPromptResponseDTO })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Prompt not found' })
  async updateMarketingPrompt(
    @Param('id') id: string,
    @Body() updateMarketingPromptDTO: UpdateMarketingPromptDTO,
  ): Promise<MarketingPromptResponseDTO> {
    return await this.marketingPromptService.updateMarketingPrompt(id, updateMarketingPromptDTO);
  }

  @Delete('admin/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.ADMIN)
  @ApiResponse({ status: 200, description: 'Marketing prompt deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Prompt not found' })
  async deleteMarketingPrompt(@Param('id') id: string): Promise<void> {
    await this.marketingPromptService.deleteMarketingPrompt(id);
  }
}