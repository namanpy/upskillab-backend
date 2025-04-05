import { Injectable, NotFoundException } from '@nestjs/common';
import { DemoSessionDataService } from './demosession.data';
import { CreateDemoSessionDto, GetDemoSessionsResponseDTO, DemoSession } from '../../dto/demosession.dto';
import { DemoSessionDocument } from '../../schemas/demosession.schema';
import { mapToDto, mapToDtoArray } from '../../common/utils/map-to-dto.util';

@Injectable()
export class DemoSessionLogicService {
  constructor(private demoSessionDataService: DemoSessionDataService) {}

  private mapToDto(demoSession: DemoSessionDocument): DemoSession {
    return mapToDto<DemoSession, DemoSessionDocument>(demoSession);
  }

  private mapToDtoArray(demoSessions: DemoSessionDocument[]): DemoSession[] {
    return mapToDtoArray<DemoSession, DemoSessionDocument>(demoSessions);
  }

  async getDemoSessions(): Promise<GetDemoSessionsResponseDTO> {
    const demoSessions = await this.demoSessionDataService.getDemoSessions();
    return {
      demoSessions: this.mapToDtoArray(demoSessions),
    };
  }

  async createDemoSession(createDemoSessionDto: CreateDemoSessionDto) {
    const demoSession = await this.demoSessionDataService.createDemoSession(createDemoSessionDto);
    return {
      demoSession: this.mapToDto(demoSession),
    };
  }

  async getDemoSessionById(id: string) {
    const demoSession = await this.demoSessionDataService.getDemoSessionById(id);
    if (!demoSession) {
      throw new NotFoundException(`DemoSession with ID ${id} not found`);
    }
    return {
      demoSession: this.mapToDto(demoSession),
    };
  }

  async updateDemoSession(id: string, updateDemoSessionDto: Partial<CreateDemoSessionDto>) {
    const demoSession = await this.demoSessionDataService.updateDemoSession(id, updateDemoSessionDto);
    if (!demoSession) {
      throw new NotFoundException(`DemoSession with ID ${id} not found`);
    }
    return {
      demoSession: this.mapToDto(demoSession),
    };
  }

  async deleteDemoSession(id: string) {
    const demoSession = await this.demoSessionDataService.deleteDemoSession(id);
    if (!demoSession) {
      throw new NotFoundException(`DemoSession with ID ${id} not found`);
    }
    return { message: 'DemoSession deleted successfully' };
  }
}