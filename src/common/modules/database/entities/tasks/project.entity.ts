import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { Base } from '../shared/base.entity';
import { ProjectPriority, ProjectStatus } from '../../models/project.model';
import { User } from '..';

@Entity({ name: 'projects' })
export class Project extends Base {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'timestamptz',
    name: 'start_date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startDate: Date;

  @Column({ type: 'timestamptz', name: 'due_date' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.InProgress,
  })
  status: ProjectStatus;

  @Column({
    type: 'enum',
    enum: ProjectPriority,
    default: ProjectPriority.Medium,
  })
  priority: ProjectPriority;

  @Column({ type: 'decimal' })
  budget: number;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}
