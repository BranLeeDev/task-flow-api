import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
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

  @Column({ type: 'integer', default: 2, name: 'members_count' })
  membersCount: number;

  @OneToMany(() => Project, (project) => project.team)
  projects: Relation<Project>;

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
