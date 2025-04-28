import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745582573366 implements MigrationInterface {
    name = 'Migrations1745582573366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."confirmation_status_enum" AS ENUM('CONFIRM', 'NOT_CONFIRM')`);
        await queryRunner.query(`CREATE TABLE "confirmation" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "userId" integer NOT NULL, "code" character varying NOT NULL, "exp" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."confirmation_status_enum" NOT NULL, CONSTRAINT "REL_74f1ebea7c18510697c0e2a6be" UNIQUE ("userId"), CONSTRAINT "PK_3eee17867bc79b59e68f5f879fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."recovery_status_enum" AS ENUM('DONE', 'IN_PROGRESS')`);
        await queryRunner.query(`CREATE TABLE "recovery" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "userId" integer NOT NULL, "code" character varying NOT NULL, "exp" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."recovery_status_enum" NOT NULL, CONSTRAINT "REL_318d006fbaa2a2aa666c3af387" UNIQUE ("userId"), CONSTRAINT "PK_47b2530af2d597ff1b210847140" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."provider_type_enum" AS ENUM('GOOGLE', 'GIT_HUB')`);
        await queryRunner.query(`CREATE TABLE "provider" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "providerId" character varying NOT NULL, "type" "public"."provider_type_enum" NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_6ab2f66d8987bf1bfdd6136a2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "nickname" character varying NOT NULL, "email" character varying NOT NULL, "hash" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "confirmation" ADD CONSTRAINT "FK_74f1ebea7c18510697c0e2a6be4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recovery" ADD CONSTRAINT "FK_318d006fbaa2a2aa666c3af387e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider" ADD CONSTRAINT "FK_da1c78142007c621b5498c818c1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider" DROP CONSTRAINT "FK_da1c78142007c621b5498c818c1"`);
        await queryRunner.query(`ALTER TABLE "recovery" DROP CONSTRAINT "FK_318d006fbaa2a2aa666c3af387e"`);
        await queryRunner.query(`ALTER TABLE "confirmation" DROP CONSTRAINT "FK_74f1ebea7c18510697c0e2a6be4"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "provider"`);
        await queryRunner.query(`DROP TYPE "public"."provider_type_enum"`);
        await queryRunner.query(`DROP TABLE "recovery"`);
        await queryRunner.query(`DROP TYPE "public"."recovery_status_enum"`);
        await queryRunner.query(`DROP TABLE "confirmation"`);
        await queryRunner.query(`DROP TYPE "public"."confirmation_status_enum"`);
    }

}
