import { Injectable, NotFoundException } from '@nestjs/common';
import { DemoSessionDataService } from './demosession.data';
import { CreateDemoSessionDto } from '../../dto/demosession.dto';
import { GetDemoSessionsResponseDTO } from '../../dto/demosession.dto';

@Injectable()
export class DemoSessionLogicService {
  constructor(private demoSessionDataService: DemoSessionDataService) {}

  async getDemoSessions(): Promise<GetDemoSessionsResponseDTO> {
    const demoSessions = await this.demoSessionDataService.getDemoSessions();
    return {
      demoSessions: demoSessions.map((session) => ({
        _id: session._id.toString(),
        fullName: session.fullName,
        email: session.email,
        phoneNumber: session.phoneNumber,
        course: session.course,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      })),
    };
  }

  async createDemoSession(createDemoSessionDto: CreateDemoSessionDto) {
    const session = await this.demoSessionDataService.createDemoSession(createDemoSessionDto);
    return {
      demoSession: {
        _id: session._id.toString(),
        fullName: session.fullName,
        email: session.email,
        phoneNumber: session.phoneNumber,
        course: session.course,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
    };
  }

  async getDemoSessionById(id: string) {
    const session = await this.demoSessionDataService.getDemoSessionById(id);
    if (!session) {
      throw new NotFoundException(`Demo session with ID ${id} not found`);
    }
    return {
      demoSession: {
        _id: session._id.toString(),
        fullName: session.fullName,
        email: session.email,
        phoneNumber: session.phoneNumber,
        course: session.course,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
    };
  }

  async updateDemoSession(id: string, updateDemoSessionDto: Partial<CreateDemoSessionDto>) {
    const session = await this.demoSessionDataService.updateDemoSession(id, updateDemoSessionDto);
    if (!session) {
      throw new NotFoundException(`Demo session with ID ${id} not found`);
    }
    return {
      demoSession: {
        _id: session._id.toString(),
        fullName: session.fullName,
        email: session.email,
        phoneNumber: session.phoneNumber,
        course: session.course,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
    };
  }

  async deleteDemoSession(id: string) {
    const session = await this.demoSessionDataService.deleteDemoSession(id);
    if (!session) {
      throw new NotFoundException(`Demo session with ID ${id} not found`);
    }
    return { message: 'Demo session deleted successfully' };
  }
}