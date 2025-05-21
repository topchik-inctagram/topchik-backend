import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745582521474 implements MigrationInterface {
    name = 'Migrations1745582521474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "key" character varying NOT NULL, "originUrl" character varying NOT NULL, "smallUrl" character varying NOT NULL, "mediumUrl" character varying NOT NULL, "index" integer NOT NULL, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "image"`);
    }

}
