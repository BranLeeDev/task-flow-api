import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { TaskPriority, TaskStatus } from '../../models/task.model';
import { Base } from '../shared/base.entity';
import { User } from '../users/user.entity';

@Entity({ name: 'tasks' })
export class Task extends Base {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'start_date',
  })
  startDate: Date;

  @Column({ type: 'timestamptz', name: 'due_date' })
  dueDate: Date;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.Pending })
  status: TaskStatus;

  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.Medium })
  priority: TaskPriority;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}
