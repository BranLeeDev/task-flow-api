import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { UserRoles } from '../../models/user.model';
import { Base } from '../shared/base.entity';
import { Project } from '../tasks/project.entity';
import { Task } from '../tasks/task.entity';
import { Team } from './team.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends Base {
  @Column({
    type: 'varchar',
    length: 25,
    nullable: true,
    name: 'first_name',
  })
  firstName?: string;

  @Column({
    type: 'varchar',
    length: 25,
    nullable: true,
    name: 'last_name',
  })
  lastName?: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.TeamMember,
  })
  role: UserRoles;

  @OneToOne(() => Team, (team) => team.leader)
  leader: Team;

  @OneToMany(() => Project, (project) => project.manager)
  projects: Relation<Project[]>;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Relation<Task[]>;

  @ManyToMany(() => Team, (team) => team.members)
  teams: Relation<Team[]>;
}
