import { Controller, Get, UseGuards } from '@nestjs/common';
import { PaymentStatusLogicService } from './payment.status.logic';
import { GetPaymentStatusResponseDTO } from '../../dto/payment-status.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guard/roles.guard';
import { USER_TYPES } from '../../common/constants/user.constants';
import { User } from '../../common/decorators/user.decorator';

@ApiTags('payment-status')
@Controller('api/payment-status')
export class PaymentStatusController {
  constructor(private paymentStatusLogicService: PaymentStatusLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get payment status for user (student) or all users (admin)',
    type: GetPaymentStatusResponseDTO,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.STUDENT, USER_TYPES.ADMIN)
  @Get()
  async getPaymentStatus(@User() user: any): Promise<GetPaymentStatusResponseDTO> {
    return await this.paymentStatusLogicService.getPaymentStatus(user);
  }
}