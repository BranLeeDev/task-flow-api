import { Column, Entity } from 'typeorm';
import { UserRoles } from '../../models/user.model';
import { Base } from '../shared/base.entity';

@Entity({ name: 'users' })
export class User extends Base {
  @Column({ type: 'varchar', length: 25, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 25, name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  password: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.TeamMember })
  role: UserRoles;
}