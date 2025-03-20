import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1738532596014 implements MigrationInterface {
    name = 'Migrations1738532596014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Avatars_type_enum" AS ENUM('avatar', 'post')`);
        await queryRunner.query(`CREATE TABLE "Avatars" ("key" character varying NOT NULL, "small" character varying NOT NULL, "original" character varying NOT NULL, "medium" character varying NOT NULL, "smallMeta" character varying NOT NULL, "originalMeta" character varying NOT NULL, "mediumMeta" character varying NOT NULL, "type" "public"."Avatars_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "ownerId" integer NOT NULL, CONSTRAINT "PK_58981b5ec09ae9111e5bc2c0768" PRIMARY KEY ("key"))`);
        await queryRunner.query(`CREATE TYPE "public"."Posts_type_enum" AS ENUM('avatar', 'post')`);
        await queryRunner.query(`CREATE TABLE "Posts" ("key" character varying NOT NULL, "small" character varying NOT NULL, "original" character varying NOT NULL, "medium" character varying NOT NULL, "smallMeta" character varying NOT NULL, "originalMeta" character varying NOT NULL, "mediumMeta" character varying NOT NULL, "type" "public"."Posts_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "postId" integer NOT NULL, CONSTRAINT "PK_d06eb16ad9cbf5d96a0820b60de" PRIMARY KEY ("key"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Posts"`);
        await queryRunner.query(`DROP TYPE "public"."Posts_type_enum"`);
        await queryRunner.query(`DROP TABLE "Avatars"`);
        await queryRunner.query(`DROP TYPE "public"."Avatars_type_enum"`);
    }

}
