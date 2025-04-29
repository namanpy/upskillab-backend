// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { ClassSession, ClassSessionDocument } from '../../schemas/class-session.schema';
// import { CreateClassSessionDto, UpdateClassSessionDto } from '../../dto/class-session.dto';

// @Injectable()
// export class ClassSessionDataService {
//   constructor(@InjectModel(ClassSession.name) private classSessionModel: Model<ClassSessionDocument>) {}

//   async getClassSessions(): Promise<ClassSessionDocument[]> {
//     return this.classSessionModel.find().populate('batchId').populate('courseId').populate('teacherId').exec();
//   }

//   async getClassSessionsByTeacher(teacherId: string): Promise<ClassSessionDocument[]> {
//     return this.classSessionModel
//       .find({ teacherId })
//       .populate('batchId')
//       .populate('courseId')
//       .populate('teacherId')
//       .exec();
//   }

//   async createClassSession(createClassSessionDto: CreateClassSessionDto): Promise<ClassSessionDocument> {
//     const newSession = new this.classSessionModel({
//       ...createClassSessionDto,
//       scheduledDate: new Date(createClassSessionDto.scheduledDate),
//     });
//     return newSession.save();
//   }

//   async getClassSessionById(id: string): Promise<ClassSessionDocument | null> {
//     return this.classSessionModel.findById(id).populate('batchId').populate('courseId').populate('teacherId').exec();
//   }

//   async updateClassSession(id: string, updateClassSessionDto: Partial<UpdateClassSessionDto>): Promise<ClassSessionDocument | null> {
//     const updateData: any = { ...updateClassSessionDto };
//     if (updateClassSessionDto.scheduledDate) {
//       updateData.scheduledDate = new Date(updateClassSessionDto.scheduledDate);
//     }
//     return this.classSessionModel
//       .findByIdAndUpdate(id, updateData, { new: true })
//       .populate('batchId')
//       .populate('courseId')
//       .populate('teacherId')
//       .exec();
//   }

//   async deleteClassSession(id: string): Promise<ClassSessionDocument | null> {
//     return this.classSessionModel.findByIdAndDelete(id).exec();
//   }

//   async checkTeacherConflict(
//     teacherId: string,
//     scheduledDate: Date,
//     startTime: string,
//     endTime: string,
//     excludeSessionId?: string,
//   ): Promise<boolean> {
//     const startMinutes = this.parseTime(startTime);
//     const endMinutes = this.parseTime(endTime);

//     const sessions = await this.classSessionModel.find({
//       teacherId,
//       scheduledDate: {
//         $gte: new Date(scheduledDate.setHours(0, 0, 0, 0)),
//         $lt: new Date(scheduledDate.setHours(23, 59, 59, 999)),
//       },
//       _id: { $ne: excludeSessionId },
//     });

//     return sessions.some(session => {
//       const sessionStart = this.parseTime(session.scheduledStartTime);
//       const sessionEnd = this.parseTime(session.scheduledEndTime);
//       return startMinutes < sessionEnd && endMinutes > sessionStart;
//     });
//   }

//   private parseTime(time: string): number {
//     const [hours, minutes] = time.split(':').map(Number);
//     return hours * 60 + minutes;
//   }
// }


import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassSession, ClassSessionDocument } from '../../schemas/class-session.schema';
import { CreateClassSessionDto, UpdateClassSessionDto } from '../../dto/class-session.dto';

@Injectable()
export class ClassSessionDataService {
  constructor(@InjectModel(ClassSession.name) private classSessionModel: Model<ClassSessionDocument>) {}

  async getClassSessions(): Promise<ClassSessionDocument[]> {
    return this.classSessionModel.find().populate('batchId').populate('teacherId').exec();
  }

  async getClassSessionsByTeacher(teacherId: string): Promise<ClassSessionDocument[]> {
    return this.classSessionModel
      .find({ teacherId })
      .populate('batchId')
      .populate('teacherId')
      .exec();
  }

  async createClassSession(createClassSessionDto: CreateClassSessionDto): Promise<ClassSessionDocument> {
    const newSession = new this.classSessionModel({
      ...createClassSessionDto,
      scheduledDate: new Date(createClassSessionDto.scheduledDate),
    });
    return newSession.save();
  }

  async getClassSessionById(id: string): Promise<ClassSessionDocument | null> {
    return this.classSessionModel.findById(id).populate('batchId').populate('teacherId').exec();
  }

  async updateClassSession(id: string, updateClassSessionDto: Partial<UpdateClassSessionDto>): Promise<ClassSessionDocument | null> {
    const updateData: any = { ...updateClassSessionDto };
    if (updateClassSessionDto.scheduledDate) {
      updateData.scheduledDate = new Date(updateClassSessionDto.scheduledDate);
    }
    return this.classSessionModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('batchId')
      .populate('teacherId')
      .exec();
  }

  async deleteClassSession(id: string): Promise<ClassSessionDocument | null> {
    return this.classSessionModel.findByIdAndDelete(id).exec();
  }

  async checkTeacherConflict(
    teacherId: string,
    scheduledDate: Date,
    startTime: string,
    endTime: string,
    excludeSessionId?: string,
  ): Promise<boolean> {
    const startMinutes = this.parseTime(startTime);
    const endMinutes = this.parseTime(endTime);

    const sessions = await this.classSessionModel.find({
      teacherId,
      scheduledDate: {
        $gte: new Date(scheduledDate.setHours(0, 0, 0, 0)),
        $lt: new Date(scheduledDate.setHours(23, 59, 59, 999)),
      },
      _id: { $ne: excludeSessionId },
    });

    return sessions.some(session => {
      const sessionStart = this.parseTime(session.scheduledStartTime);
      const sessionEnd = this.parseTime(session.scheduledEndTime);
      return startMinutes < sessionEnd && endMinutes > sessionStart;
    });
  }

  private parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}