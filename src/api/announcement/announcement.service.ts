import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAnnouncementDto,UpdateAnnouncementDto } from 'src/dto/announcement.dto';
import { Announcement,AnnouncementDocument } from 'src/schemas/announcement.schema';
@Injectable()
export class AnnouncementService {
  constructor(
    @InjectModel(Announcement.name) private model: Model<AnnouncementDocument>
  ) {}

  async create(dto: CreateAnnouncementDto): Promise<Announcement> {
    const created = new this.model(dto);
    return created.save();
  }

  async findAll(): Promise<Announcement[]> {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async update(id: string, dto: UpdateAnnouncementDto): Promise<Announcement> {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Announcement not found');
    return updated;
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.model.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Announcement not found');
    return { message: 'Announcement deleted successfully' };
  }
}
