import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddUserToOrganisationDto, CreateOrganisationDto } from 'src/module/v1/organisation/dtos/organisation.dto';
import { Organisation } from 'src/module/v1/organisation/entities/organisation.entity';
import { User } from 'src/module/v1/user/entities/user.entity';
import { UserService } from 'src/module/v1/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class OrganisationService {
  constructor(
    @InjectRepository(Organisation) private organisationRepository: Repository<Organisation>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async createOrganisation(payload: CreateOrganisationDto, user: User) {
    const { name, description } = payload;

    const createdOrg = await this.organisationRepository.save(
      this.organisationRepository.create({ name, description, users: [user] }),
    );

    delete createdOrg.users;
    return createdOrg;
  }

  async getOrganisationById(id: string) {
    const organisation = await this.organisationRepository.findOne({ where: { orgId: id } });

    return organisation;
  }

  async getUserOrganisations(user: User) {
    const organisations = await this.organisationRepository.find({ where: { users: user } });

    return { organisations };
  }

  async addUserToOrganisation(orgId: string, payload: AddUserToOrganisationDto) {
    const { userId } = payload;

    const organisation = await this.organisationRepository.findOne({ where: { orgId }, relations: ['users'] });

    if (!organisation) {
      throw new NotFoundException('Organisation not found');
    }

    if (organisation.users.find(user => user.userId === userId)) {
      throw new BadRequestException('User already exists in organisation');
    }

    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    organisation.users.push(user);
    await this.organisationRepository.save(organisation);
  }
}
