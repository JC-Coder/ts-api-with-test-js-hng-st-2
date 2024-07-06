import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { BaseHelper } from '../../../common/utils/helper.util';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/module/v1/user/dto/user.dto';
import { ISignJwtToken } from 'src/common/interfaces/auth.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService: UserService) {}

  async register(payload: CreateUserDto) {
    const user = await this.userService.createUser(payload);
    delete user?.password;

    return {
      user,
      accessToken: await this.signJwtToken({ userId: user.userId }),
    };
  }

  async login(payload: LoginDto) {
    const { email, password } = payload;

    const user = await this.userService.getUserByEmailIncludePassword(email);

    if (!user) {
      throw new UnauthorizedException('Authentication failed');
    }

    const passwordMatch = await BaseHelper.compareHashedData(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Authentication failed');
    }

    delete user?.password;

    return {
      user,
      accessToken: await this.signJwtToken({ userId: user.userId }),
    };
  }

  async signJwtToken(payload: ISignJwtToken) {
    const { userId } = payload;

    return await this.jwtService.signAsync({ userId }, { expiresIn: '5d' });
  }
}
