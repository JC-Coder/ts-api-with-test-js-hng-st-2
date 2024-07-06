import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseHelper } from '../../../../common/utils/helper.util';
import { Organisation } from '../../organisation/entities/organisation.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: true, default: null })
  phone: string;

  @ManyToMany(() => Organisation, organisation => organisation.users)
  @JoinTable()
  organisations: Organisation[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await BaseHelper.hashData(this.password);
  }
}
