import { BaseHelper } from 'src/common/utils/helper.util';
import { Organisation } from 'src/module/v1/organisation/entities/organisation.entity';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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
