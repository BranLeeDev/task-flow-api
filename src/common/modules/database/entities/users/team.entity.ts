import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { Base } from '../shared/base.entity';
import { Project } from '../tasks/project.entity';

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
}
