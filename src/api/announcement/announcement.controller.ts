import { Controller, Post, Get, Body, Param, Patch, Delete } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto,UpdateAnnouncementDto } from 'src/dto/announcement.dto';

@Controller('announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post()
  async create(@Body() createDto: CreateAnnouncementDto) {
    return this.announcementService.create(createDto);
  }

  @Get()
  async findAll() {
    return this.announcementService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateAnnouncementDto) {
    return this.announcementService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.announcementService.delete(id);
  }
}
