import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745590879933 implements MigrationInterface {
    name = 'Migrations1745590879933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."image_entity_type_enum" AS ENUM('avatar', 'post')`);
        await queryRunner.query(`CREATE TABLE "image_entity" ("id" character varying NOT NULL, "ownerId" integer NOT NULL, "index" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "small" character varying NOT NULL, "original" character varying NOT NULL, "medium" character varying NOT NULL, "smallMeta" character varying NOT NULL, "originalMeta" character varying NOT NULL, "mediumMeta" character varying NOT NULL, "type" "public"."image_entity_type_enum" NOT NULL, CONSTRAINT "PK_fb554818daabc01db00d67aafde" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "image_entity"`);
        await queryRunner.query(`DROP TYPE "public"."image_entity_type_enum"`);
    }

}
