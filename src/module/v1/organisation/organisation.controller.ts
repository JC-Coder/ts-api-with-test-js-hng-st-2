import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { RESPONSE_CONSTANT } from '../../../common/constants/response.constant';
import { LoggedInUserDecorator } from '../../../common/decorators/logged_in_user.decorator';
import { ResponseMessage } from '../../../common/decorators/response.decorator';
import { User } from '../user/entities/user.entity';
import { CreateOrganisationDto, AddUserToOrganisationDto } from './dtos/organisation.dto';

@Controller('organisations')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  @ResponseMessage(RESPONSE_CONSTANT.ORG.CREATE_SUCCESS)
  @Post()
  async createOrganisation(@LoggedInUserDecorator() user: User, @Body() payload: CreateOrganisationDto) {
    const createdOrg = await this.organisationService.createOrganisation(payload, user);

    if (!createdOrg) {
      throw new BadRequestException('Client error');
    }

    return createdOrg;
  }

  @Get()
  async getUserOrganisations(@LoggedInUserDecorator() user: User) {
    return await this.organisationService.getUserOrganisations(user);
  }

  @Get(':orgId')
  async getOrganisationById(@Param('orgId') id: string, @LoggedInUserDecorator() user: User) {
    return await this.organisationService.getOrganisationById(id, user);
  }

  @ResponseMessage(RESPONSE_CONSTANT.ORG.ADD_USER_SUCCESS)
  @Post(':orgId/users')
  async addUserToOrganisation(@Param('orgId') orgId: string, @Body() payload: AddUserToOrganisationDto) {
    return await this.organisationService.addUserToOrganisation(orgId, payload);
  }
}
