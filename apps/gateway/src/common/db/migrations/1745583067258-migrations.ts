import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745583067258 implements MigrationInterface {
    name = 'Migrations1745583067258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "userId" integer NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_image" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "postId" integer NOT NULL, "imageId" integer NOT NULL, CONSTRAINT "REL_19ab0988628f90a64c49cda3ab" UNIQUE ("imageId"), CONSTRAINT "PK_0c74d0ac8869bc3a3cbaa3ec55d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_image" ADD CONSTRAINT "FK_668c9fb892f2accb872670c7b1e" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_image" ADD CONSTRAINT "FK_19ab0988628f90a64c49cda3aba" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_image" DROP CONSTRAINT "FK_19ab0988628f90a64c49cda3aba"`);
        await queryRunner.query(`ALTER TABLE "post_image" DROP CONSTRAINT "FK_668c9fb892f2accb872670c7b1e"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`);
        await queryRunner.query(`DROP TABLE "post_image"`);
        await queryRunner.query(`DROP TABLE "post"`);
    }

}
