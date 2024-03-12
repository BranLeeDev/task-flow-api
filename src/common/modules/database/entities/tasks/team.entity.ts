import { Column, Entity } from 'typeorm';
import { Base } from '../shared/base.entity';

@Entity({ name: 'teams' })
export class Team extends Base {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;
}
