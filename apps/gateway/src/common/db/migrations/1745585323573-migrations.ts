import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745585323573 implements MigrationInterface {
    name = 'Migrations1745585323573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "avatarId" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "avatarId" SET NOT NULL`);
    }

}
