import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745586184611 implements MigrationInterface {
    name = 'Migrations1745586184611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recovery" ALTER COLUMN "code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recovery" ALTER COLUMN "exp" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recovery" ALTER COLUMN "exp" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recovery" ALTER COLUMN "code" SET NOT NULL`);
    }

}
