import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganisationService } from 'src/module/v1/organisation/organisation.service';
import { CreateUserDto } from 'src/module/v1/user/dto/user.dto';
import { User } from 'src/module/v1/user/entities/user.entity';
import { Repository } from 'typeorm';

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
      throw new BadRequestException('Registration unsuccessful');
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
