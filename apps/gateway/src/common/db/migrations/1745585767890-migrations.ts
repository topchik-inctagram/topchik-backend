import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745585767890 implements MigrationInterface {
    name = 'Migrations1745585767890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "confirmation" ALTER COLUMN "code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "confirmation" ALTER COLUMN "exp" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "confirmation" ALTER COLUMN "exp" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "confirmation" ALTER COLUMN "code" SET NOT NULL`);
    }

}
