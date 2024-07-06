import { User } from 'src/module/v1/user/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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
