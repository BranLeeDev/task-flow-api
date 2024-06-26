import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { Base } from '../shared/base.entity';
import { User } from './user.entity';

@Entity({ name: 'teams' })
export class Team extends Base {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToOne(() => User, (user) => user.leader, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'leader_id' })
  leader: Relation<User>;

  @ManyToMany(() => User, (user) => user.teams)
  @JoinTable({
    name: 'teams_users',
    joinColumn: {
      name: 'team_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  members: Relation<User[]>;
}
