import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLeaderColumn1710590791156 implements MigrationInterface {
  name = 'AddLeaderColumn1710590791156';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "teams" ADD "leader_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "UQ_10c8e335dc32010ef90abe65cec" UNIQUE ("leader_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "FK_10c8e335dc32010ef90abe65cec" FOREIGN KEY ("leader_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "FK_10c8e335dc32010ef90abe65cec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "UQ_10c8e335dc32010ef90abe65cec"`,
    );
    await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "leader_id"`);
  }
}
