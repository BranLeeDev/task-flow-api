import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1710337261928 implements MigrationInterface {
  name = 'Init1710337261928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE users_role_enum AS ENUM ('team-member', 'project-manager', 'administrator', 'leader')`,
    );
    await queryRunner.query(
      `CREATE TYPE projects_status_enum AS ENUM ('in-progress', 'completed', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TYPE projects_priority_enum AS ENUM ('low', 'medium', 'high')`,
    );
    await queryRunner.query(
      `CREATE TYPE tasks_status_enum AS ENUM ('pending', 'in-progress', 'completed', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TYPE tasks_priority_enum AS ENUM ('low', 'medium', 'high')`,
    );
    await queryRunner.query(
      `CREATE TABLE "teams" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "description" text, "members_count" integer NOT NULL DEFAULT '2', CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "description" text, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "due_date" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."projects_status_enum" NOT NULL DEFAULT 'in-progress', "priority" "public"."projects_priority_enum" NOT NULL DEFAULT 'medium', "budget" numeric NOT NULL, "manager_id" integer, "team_id" integer, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "description" text, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "due_date" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'pending', "priority" "public"."tasks_priority_enum" NOT NULL DEFAULT 'medium', "user_id" integer, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "first_name" character varying(25), "last_name" character varying(25), "email" character varying(100) NOT NULL, "password" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'team-member', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "teams_users" ("team_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_7ef73da7c71c3028ec52cd3681d" PRIMARY KEY ("team_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_29718c15b653166d708c49b357" ON "teams_users" ("team_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2a578f7a5be3b6bec99bfb8d6a" ON "teams_users" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "projects_users" ("project_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_2bdf8b14b34ac191f9fa6c67672" PRIMARY KEY ("project_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b7d782db86a3dc1bd3b7eaed1f" ON "projects_users" ("project_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_274bd757ae91379bf033a2dacc" ON "projects_users" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_87bd52575ded2be008b89dd7b21" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_ce17f8b1c8016554cafa2dc8fb5" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_db55af84c226af9dce09487b61b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams_users" ADD CONSTRAINT "FK_29718c15b653166d708c49b357b" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams_users" ADD CONSTRAINT "FK_2a578f7a5be3b6bec99bfb8d6ac" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects_users" ADD CONSTRAINT "FK_b7d782db86a3dc1bd3b7eaed1fd" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects_users" ADD CONSTRAINT "FK_274bd757ae91379bf033a2daccd" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects_users" DROP CONSTRAINT "FK_274bd757ae91379bf033a2daccd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects_users" DROP CONSTRAINT "FK_b7d782db86a3dc1bd3b7eaed1fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams_users" DROP CONSTRAINT "FK_2a578f7a5be3b6bec99bfb8d6ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams_users" DROP CONSTRAINT "FK_29718c15b653166d708c49b357b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_db55af84c226af9dce09487b61b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_ce17f8b1c8016554cafa2dc8fb5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_87bd52575ded2be008b89dd7b21"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_274bd757ae91379bf033a2dacc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b7d782db86a3dc1bd3b7eaed1f"`,
    );
    await queryRunner.query(`DROP TABLE "projects_users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2a578f7a5be3b6bec99bfb8d6a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_29718c15b653166d708c49b357"`,
    );
    await queryRunner.query(`DROP TABLE "teams_users"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "teams"`);
  }
}
