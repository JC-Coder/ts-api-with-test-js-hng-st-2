import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/module/v1/user/entities/user.entity';
import { OrganisationModule } from 'src/module/v1/organisation/organisation.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), OrganisationModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
