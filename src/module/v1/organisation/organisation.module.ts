import { Module, forwardRef } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisation } from 'src/module/v1/organisation/entities/organisation.entity';
import { UserModule } from 'src/module/v1/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Organisation]), forwardRef(() => UserModule)],
  controllers: [OrganisationController],
  providers: [OrganisationService],
  exports: [OrganisationService],
})
export class OrganisationModule {}
