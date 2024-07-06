import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganisationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class AddUserToOrganisationDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
