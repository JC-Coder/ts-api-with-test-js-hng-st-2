import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../../../common/configs/database.config';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig)],
})
export class DatabaseModule {}
