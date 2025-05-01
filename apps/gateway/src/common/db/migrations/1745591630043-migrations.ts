import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745591630043 implements MigrationInterface {
    name = 'Migrations1745591630043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "description" SET NOT NULL`);
    }

}
