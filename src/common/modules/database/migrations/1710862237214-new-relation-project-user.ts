import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewRelationProjectUser1710862237214 implements MigrationInterface {
  name = 'NewRelationProjectUser1710862237214';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_361a53ae58ef7034adc3c06f09f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_361a53ae58ef7034adc3c06f09f"`,
    );
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "userId"`);
  }
}
