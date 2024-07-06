import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Organisation } from 'src/module/v1/organisation/entities/organisation.entity';
import { User } from 'src/module/v1/user/entities/user.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Organisation],
  synchronize: true,
};
