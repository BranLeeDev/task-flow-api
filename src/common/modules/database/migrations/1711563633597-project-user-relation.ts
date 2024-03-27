import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectUserRelation1711563633597 implements MigrationInterface {
  name = 'ProjectUserRelation1711563633597';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_ce17f8b1c8016554cafa2dc8fb5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" RENAME COLUMN "team_id" TO "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_bd55b203eb9f92b0c8390380010" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_bd55b203eb9f92b0c8390380010"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" RENAME COLUMN "user_id" TO "team_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_ce17f8b1c8016554cafa2dc8fb5" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
