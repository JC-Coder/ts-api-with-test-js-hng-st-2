import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Organisation {
  @PrimaryGeneratedColumn('uuid')
  orgId: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true, default: null })
  description: string;

  @ManyToMany(() => User, user => user.organisations)
  users: User[];
}
