import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745582867300 implements MigrationInterface {
    name = 'Migrations1745582867300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "device" ("id" character varying NOT NULL, "title" character varying NOT NULL, "ip" character varying NOT NULL, "exp" integer NOT NULL, "iat" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc"`);
        await queryRunner.query(`DROP TABLE "device"`);
    }

}
