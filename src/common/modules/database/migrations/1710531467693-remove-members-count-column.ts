import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveMembersCountColumn1710531467693
  implements MigrationInterface
{
  name = 'RemoveMembersCountColumn1710531467693';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('teams', 'members_count');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'teams',
      new TableColumn({
        name: 'members_count',
        type: 'integer',
        default: 2,
      }),
    );
  }
}
