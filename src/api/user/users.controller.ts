import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersLogicService } from './users.logic';
import { GetUserRequestDTO, GetUserResponseDTO, UpdateUserRequestDTO, UpdateUserResponseDTO } from 'src/dto/user.dto';

@Controller('users')
export class UsersController {

  constructor(private usersLogicService: UsersLogicService) {}

  @ApiTags('Users')
  @ApiResponse({
    status: 200,
    description: 'Get Users',
    type: GetUserResponseDTO,
  })
  @Get('')
  async users(
    @Query() inputs: GetUserRequestDTO,
  ):Promise<GetUserResponseDTO> {
    const searchString = `${inputs.username || ''} ${inputs.email || ''} ${inputs.mobileNumber || ''}`.trim();
    return await this.usersLogicService.findbyUsernameorEmailorMobile({ searchString });
  }
  @ApiTags('Users')
  @ApiResponse({
    status: 200,
    description: 'Update user details',
    type: UpdateUserResponseDTO,
  })

  @Put(':_id')
  async updateUser(
    @Body() updateData: UpdateUserRequestDTO,
    @Param('_id') _id: string,
  ): Promise<UpdateUserResponseDTO> {
    const { username, email, mobileNumber } = updateData;
    
    const result = await this.usersLogicService.updateUserDetails({
      _id,
      username,
      email,
      mobileNumber,
    });
    return result as UpdateUserResponseDTO;
  }
  @ApiResponse({
    status: 200,
    description: 'User login',
  })
  @Post('login')
  async loginUser(@Body() loginDto: { username: string; password: string }) {
    // TODO: Implement login logic
    return {
      message: 'Login successful',
      username: loginDto.username,
    };
  }
}
