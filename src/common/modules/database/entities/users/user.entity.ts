import { Column, Entity, ManyToMany, OneToMany, Relation } from 'typeorm';
import { UserRoles } from '../../models/user.model';
import { Base } from '../shared/base.entity';
import { Project } from '../tasks/project.entity';
import { Task } from '../tasks/task.entity';
import { Team } from './team.entity';

@Entity({ name: 'users' })
export class User extends Base {
  @Column({
    type: 'varchar',
    length: 25,
    nullable: true,
    name: 'first_name',
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 25,
    nullable: true,
    name: 'last_name',
  })
  lastName: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.TeamMember,
  })
  role: UserRoles;

  @OneToMany(() => Project, (project) => project.manager)
  managerProjects: Relation<Project[]>;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Relation<Task[]>;

  @ManyToMany(() => Project, (project) => project.users)
  userProjects: Relation<Project[]>;

  @ManyToMany(() => Team, (team) => team.members)
  teams: Relation<Team[]>;
}
