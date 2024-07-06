import { Module } from '@nestjs/common';
import { DatabaseModule } from './module/v1/database/database.module';
import { AuthModule } from './module/v1/auth/auth.module';
import { UserModule } from './module/v1/user/user.module';
import { OrganisationModule } from './module/v1/organisation/organisation.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, OrganisationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
