import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminStudentsDataService } from './admin-students.data';
import { StudentsResponseDto, StudentResponseDto, UpdateStudentDto, DeleteStudentResponseDto } from './admin-students.dto';

@Injectable()
export class AdminStudentsLogicService {
  constructor(private adminStudentsDataService: AdminStudentsDataService) {}

  async getStudents(): Promise<StudentsResponseDto> {
    const studentData = await this.adminStudentsDataService.getStudents();
    return {
      students: studentData.map((data) => this.mapToStudentResponseDto(data)),
    };
  }

  async updateStudent(studentId: string, updateStudentDto: UpdateStudentDto): Promise<StudentResponseDto> {
    const { user, student } = await this.adminStudentsDataService.updateStudent(studentId, updateStudentDto);
    const orders = await this.adminStudentsDataService.getOrdersByUserId(user._id.toString());
    return this.mapToStudentResponseDto({ user, student, orders });
  }

  async deleteStudent(studentId: string): Promise<DeleteStudentResponseDto> {
    await this.adminStudentsDataService.deleteStudent(studentId);
    return { message: 'Student deleted successfully' };
  }

  private mapToStudentResponseDto(data: {
    user: any;
    student: any;
    orders: Array<any & { batchDetails: any }>;
  }): StudentResponseDto {
    return {
      _id: data.student._id,
      email: data.user.email,
      mobileNumber: data.user.mobileNumber,
      fullName: data.student.fullName,
      isActive: data.user.isActive,
      orders: data.orders.map((order) => ({
        batchId: order.batch,
        batchName: order.batchDetails?.name || 'N/A', // Assuming 'name' is the field for batchName
        courseId: order.batchDetails?.course || 'N/A', // Assuming 'course' is the field for courseId
        status: order.status,
        mobileNumber: order.mobileNumber,
        totalAmount: order.totalAmount,
        amountPaid: order.amountPaid,
      })),
    };
  }
}