import { Column, Entity } from 'typeorm';
import { TaskPriority, TaskStatus } from '../../models/task.model';
import { Base } from '../shared/base.entity';

@Entity({ name: 'tasks' })
export class Task extends Base {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'datetime', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'datetime', name: 'due_date' })
  dueDate: Date;

  @Column({ type: 'enum', enum: TaskStatus })
  status: TaskStatus;

  @Column({ type: 'enum', enum: TaskPriority })
  priority: TaskPriority;
}
