import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserWithFullDetails: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should generate a token that expires at the correct time', async () => {
    const userId = 'testUserId';
    const expiresIn = '5d';

    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mockedToken');

    await authService.signJwtToken({ userId });

    expect(jwtService.signAsync).toHaveBeenCalledWith({ userId }, { expiresIn });
  });

  it('should include correct user details in the token', async () => {
    const userId = 'testUserId';
    const user = {
      userId,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '1234567890',
      password: 'password',
    };

    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ userId });
    jest.spyOn(authService['userService'], 'getUserWithFullDetails').mockResolvedValue(user as User);

    const result = await jwtService.verifyAsync('mockedToken');

    expect(result).toEqual({ userId });
  });
});
