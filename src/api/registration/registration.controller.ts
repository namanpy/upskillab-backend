import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ERROR } from 'src/common/constants/error.constants';
import {
  BatchRegistrationRequestDto,
  BatchRegistrationResponseDto,
  NoBatchRegistrationRequestDto,
  NoBatchRegistrationResponseDto,
  NoBatchsRegistrationRequestDto,
  NoBatchsRegistrationResponseDto,
  registerExternelPaymentDto,
} from 'src/dto/registration.dto';
import { RegistrationLogicService } from './registration.logic';
import { bool } from 'aws-sdk/clients/redshiftdata';

@ApiTags('registration')
@Controller('registration')
export class RegistrationController {
  constructor(private registrationLogicService: RegistrationLogicService) {}

  @Post('batch')
  @ApiResponse({
    status: 200,
    type: BatchRegistrationResponseDto,
  })
  @ApiResponse({
    status: ERROR.BATCH_NOT_FOUND.code,
    description: ERROR.BATCH_NOT_FOUND.message,
  })
  @ApiResponse({
    status: ERROR.BATCH_NOT_ACTIVE.code,
    description: ERROR.BATCH_NOT_ACTIVE.message,
  })
  @ApiResponse({
    status: ERROR.BATCH_FULL.code,
    description: ERROR.BATCH_FULL.message,
  })
  async registerForBatch(
    @Body() registrationData: BatchRegistrationRequestDto,
  ): Promise<BatchRegistrationResponseDto> {
    return await this.registrationLogicService.registerForBatch(
      registrationData,
    );
  }

  @Post('with-batch')
  @ApiResponse({
    status: 200,
    type: NoBatchRegistrationResponseDto,
  })
  async registerWithNoBatch(
    @Body() registrationData: NoBatchRegistrationRequestDto,
  ): Promise<NoBatchRegistrationResponseDto> {
    console.log(registrationData)
    return await this.registrationLogicService.registerNoBatch(
      registrationData,
    );
  }

  @Post('no-batch')
  @ApiResponse({
    status: 200,
    type: NoBatchsRegistrationResponseDto,
  })
  async registerWithNoBatchs(
    @Body() registrationData: NoBatchsRegistrationRequestDto,
  ): Promise<NoBatchsRegistrationResponseDto> {
    return await this.registrationLogicService.registerNoBatchs(
      registrationData,
    );
  }

  @Post('externel_payment')
  @ApiResponse({
    status: 200,
  })
  async registerExternelPayment(
    @Body() registrationData: registerExternelPaymentDto,
  ): Promise<any> {
    return await this.registrationLogicService.registerExternelPayment(
      registrationData,
    );
  }
}