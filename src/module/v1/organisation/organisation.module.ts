import { Module, forwardRef } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Organisation } from './entities/organisation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organisation]), forwardRef(() => UserModule)],
  controllers: [OrganisationController],
  providers: [OrganisationService],
  exports: [OrganisationService],
})
export class OrganisationModule {}
