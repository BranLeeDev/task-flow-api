import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultValue1710861201231 implements MigrationInterface {
  name = 'AddDefaultValue1710861201231';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects" ALTER COLUMN "start_date" SET DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects" ALTER COLUMN "start_date" DROP DEFAULT`,
    );
  }
}
