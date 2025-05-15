import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { Student, StudentDocument } from '../../schemas/student.schema';
import { Order, OrderDocument } from '../../schemas/order.schema';
import { Batch, BatchDocument } from '../../schemas/course/batch.schema';
import { Course, CourseDocuments } from '../../schemas/course/course.schema';
import { StudentInfoDTO, StudentInfoResponseDTO, OrderHistoryDTO } from '../../dto/student-info.dto';
import { USER_TYPES } from '../../common/constants/user.constants';
import { ORDER_STATUS } from '../../common/constants/order.constants';

@Injectable()
export class StudentInfoLogicService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Batch.name) private batchModel: Model<BatchDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocuments>,
  ) {}

  private async mapToOrderHistoryDTO(order: any): Promise<OrderHistoryDTO> {
    const batch = await this.batchModel.findById(order.batch).select('course').exec();
    const course = batch ? await this.courseModel.findById(batch.course).select('title').exec() : null;

    return {
      orderId: order._id.toString(),
      totalAmount: order.totalAmount,
      amountPaid: order.amountPaid,
      status: order.status,
      batchId: order.batch.toString(),
      courseId: batch?.course?.toString() || '',
      courseTitle: course?.courseName || 'Unknown',
    };
  }

  private async mapToStudentInfoDTO(user: any, student: any): Promise<StudentInfoDTO> {
    const orders = await this.orderModel
      .find({ user: user._id })
      .populate('batch')
      .exec();
    
    const orderHistory = await Promise.all(orders.map(order => this.mapToOrderHistoryDTO(order)));
    const completedCourses = orders.filter(o => o.status === ORDER_STATUS.COMPLETED.code).length;
    const pendingCourses = orders.filter(o => o.status === ORDER_STATUS.PENDING.code).length;

    return {
      userId: user._id.toString(),
      email: user.email,
      mobileNumber: user.mobileNumber,
      username: user.username,
      isActive: user.isActive,
      fullName: student.fullName,
      college: student.college,
      studentType: student.studentType,
      image: student.image,
      bio: student.bio,
      skills: student.skills,
      orderHistory,
      completedCourses,
      pendingCourses,
    };
  }

  async getStudentInfo(user: any): Promise<StudentInfoResponseDTO> {
    console.log('getStudentInfo: User:', JSON.stringify(user, null, 2));

    if (user.userType === USER_TYPES.ADMIN) {
      console.log('getStudentInfo: Fetching all students (Admin)');
      const students = await this.studentModel.find().populate('user').exec();
      const studentInfos = await Promise.all(
        students.map(student => {
          return this.userModel
            .findById(student.user)
            .exec()
            .then(user => (user ? this.mapToStudentInfoDTO(user, student) : null));
        }),
      );
      return {
        students: studentInfos.filter(info => info !== null) as StudentInfoDTO[],
      };
    }

    if (user.userType !== USER_TYPES.STUDENT) {
      console.log('getStudentInfo: Forbidden - User is not a student or admin:', user.userType);
      throw new ForbiddenException('Only students or admins can access student info');
    }

    console.log('getStudentInfo: Fetching student info for user:', user._id);
    const student = await this.studentModel.findOne({ user: user._id }).exec();
    if (!student) {
      console.log('getStudentInfo: Student profile not found for user:', user._id);
      throw new ForbiddenException('Student profile not found');
    }

    const userDoc = await this.userModel.findById(user._id).exec();
    if (!userDoc) {
      console.log('getStudentInfo: User not found:', user._id);
      throw new ForbiddenException('User not found');
    }

    const studentInfo = await this.mapToStudentInfoDTO(userDoc, student);
    return {
      students: [studentInfo],
    };
  }
}