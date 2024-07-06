import { BadRequestException, Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { LoggedInUserDecorator } from 'src/common/decorators/logged_in_user.decorator';
import { User } from 'src/module/v1/user/entities/user.entity';
import { AddUserToOrganisationDto, CreateOrganisationDto } from 'src/module/v1/organisation/dtos/organisation.dto';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { RESPONSE_CONSTANT } from 'src/common/constants/response.constant';

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
  async getOrganisationById(@Param('orgId') id: string) {
    return await this.organisationService.getOrganisationById(id);
  }

  @ResponseMessage(RESPONSE_CONSTANT.ORG.ADD_USER_SUCCESS)
  @Post(':orgId/users')
  async addUserToOrganisation(@Param('orgId') orgId: string, @Body() payload: AddUserToOrganisationDto) {
    return await this.organisationService.addUserToOrganisation(orgId, payload);
  }
}
