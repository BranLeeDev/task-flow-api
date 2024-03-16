import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { Base } from '../shared/base.entity';
import { Project } from '../tasks/project.entity';
import { User } from './user.entity';

@Entity({ name: 'teams' })
export class Team extends Base {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Project, (project) => project.team)
  projects: Relation<Project>;

  @OneToOne(() => User, (user) => user.leader)
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
