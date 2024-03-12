import { Column, Entity } from 'typeorm';
import { Base } from '../shared/base.entity';
import { ProjectPriority, ProjectStatus } from '../../models/project.model';

@Entity({ name: 'projects' })
export class Project extends Base {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'datetime', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'datetime', name: 'due_date' })
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
}
