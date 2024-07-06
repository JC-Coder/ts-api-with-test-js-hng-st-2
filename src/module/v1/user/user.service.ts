import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/module/v1/user/dto/user.dto';
import { Repository } from 'typeorm';
import { OrganisationService } from '../organisation/organisation.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private organisationService: OrganisationService,
  ) {}

  async createUser(payload: CreateUserDto) {
    const { email } = payload;

    // check if user already exists
    const userWithEmailExists = await this.userRepository.exists({ where: { email: email } });

    if (userWithEmailExists) {
      throw new UnprocessableEntityException('Registration unsuccessful');
    }

    const createdUser = await this.userRepository.save(this.userRepository.create(payload));

    if (createdUser) {
      const org = await this.organisationService.createOrganisation(
        {
          name: `${createdUser.firstName}'s Organisation`,
        },
        createdUser,
      );

      if (!org) {
        await this.userRepository.delete({ userId: createdUser.userId });
      }
    }

    return createdUser;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('Invalid Email');
    }

    return user;
  }

  async getUserByEmailIncludePassword(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ email })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new BadRequestException('Invalid Email');
    }

    return user;
  }

  async getUserWithFullDetails(id: string) {
    const user = await this.userRepository.findOne({ where: { userId: id } });

    if (!user) {
      throw new BadRequestException('Invalid User Id');
    }

    return user;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { userId: id } });

    if (!user) {
      throw new NotFoundException('Invalid User Id');
    }

    return user;
  }
}
