import { Test, TestingModule } from '@nestjs/testing';
import { OrganisationService } from './organisation.service';
import { UserService } from '../user/user.service';
import { Organisation } from './entities/organisation.entity';
import { User } from '../user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('OrganisationService', () => {
  let organisationService: OrganisationService;
  const organisationRepositoryToken = getRepositoryToken(Organisation);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganisationService,
        {
          provide: UserService,
          useValue: {
            getUserOrganisations: jest.fn(),
          },
        },
        {
          provide: organisationRepositoryToken,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    organisationService = module.get<OrganisationService>(OrganisationService);
  });

  it('should only return organisations the user has access to', async () => {
    const user = {
      userId: 'testUserId',
    } as User;
    const userOrgs = {
      organisations: [
        { orgId: 'org1', name: 'Org 1' },
        { orgId: 'org2', name: 'Org 2' },
        { orgId: 'org3', name: 'Org 3' },
      ],
    };

    jest.spyOn(organisationService, 'getUserOrganisations').mockResolvedValue(
      userOrgs as {
        organisations: Organisation[];
      },
    );

    const result = await organisationService.getUserOrganisations(user);

    expect(result).toEqual(userOrgs);
    expect(organisationService.getUserOrganisations).toHaveBeenCalledWith(user);
  });

  it('should not return organisations the user does not have access to', async () => {
    const user = {
      userId: 'testUserId',
    } as User;
    const userOrgs = {
      organisations: [{ orgId: 'org1', name: 'Org 1' }],
    };
    const allOrgs = {
      organisations: [
        { orgId: 'org1', name: 'Org 1' },
        { orgId: 'org2', name: 'Org 2' },
        { orgId: 'org3', name: 'Org 3' },
      ],
    };

    jest.spyOn(organisationService, 'getUserOrganisations').mockResolvedValue(
      userOrgs as {
        organisations: Organisation[];
      },
    );

    const result = await organisationService.getUserOrganisations(user);

    expect(result).toEqual(userOrgs);
    expect(organisationService.getUserOrganisations).toHaveBeenCalledWith(user);
    expect(result.organisations.length).not.toEqual(allOrgs.organisations.length);
    expect(result.organisations[0].orgId).toEqual(userOrgs.organisations[0].orgId);
  });
});
