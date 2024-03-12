import { Column, Entity } from 'typeorm';
import { Base } from '../shared/base.entity';

@Entity({ name: 'teams' })
export class Team extends Base {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer', default: 2, name: 'members_count' })
  membersCount: number;
}
