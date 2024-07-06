import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseMessage } from '../../../common/decorators/response.decorator';
import { LoginDto } from './dto/auth.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { RESPONSE_CONSTANT } from '../../../common/constants/response.constant';
import { CreateUserDto } from '../../../module/v1/user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(201)
  @Post('register')
  @ResponseMessage(RESPONSE_CONSTANT.AUTH.REGISTER_SUCCESS)
  async register(@Body() payload: CreateUserDto) {
    return await this.authService.register(payload);
  }

  @Public()
  @HttpCode(200)
  @Post('login')
  @ResponseMessage(RESPONSE_CONSTANT.AUTH.LOGIN_SUCCESS)
  async login(@Body() payload: LoginDto) {
    return await this.authService.login(payload);
  }
}
