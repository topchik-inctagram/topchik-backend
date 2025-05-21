import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745582975424 implements MigrationInterface {
    name = 'Migrations1745582975424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "avatar" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "profileId" integer NOT NULL, "imageId" integer NOT NULL, CONSTRAINT "REL_06f902f984e37d13d567c588a5" UNIQUE ("profileId"), CONSTRAINT "REL_47b1d7bc8a919e0148ec54285e" UNIQUE ("imageId"), CONSTRAINT "PK_50e36da9d45349941038eaf149d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "firstName" character varying NOT NULL DEFAULT '', "lastName" character varying NOT NULL DEFAULT '', "dateOfBirth" character varying, "aboutMe" character varying NOT NULL DEFAULT '', "userId" integer NOT NULL, "avatarId" integer NOT NULL, "countryId" integer, "cityId" integer, CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), CONSTRAINT "REL_7805076027b2cc3f88ee9a081b" UNIQUE ("countryId"), CONSTRAINT "REL_350e025f4336b40a3c876ee9e3" UNIQUE ("cityId"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "avatar" ADD CONSTRAINT "FK_06f902f984e37d13d567c588a5e" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "avatar" ADD CONSTRAINT "FK_47b1d7bc8a919e0148ec54285e2" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_7805076027b2cc3f88ee9a081b5" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_350e025f4336b40a3c876ee9e33" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_350e025f4336b40a3c876ee9e33"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_7805076027b2cc3f88ee9a081b5"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"`);
        await queryRunner.query(`ALTER TABLE "avatar" DROP CONSTRAINT "FK_47b1d7bc8a919e0148ec54285e2"`);
        await queryRunner.query(`ALTER TABLE "avatar" DROP CONSTRAINT "FK_06f902f984e37d13d567c588a5e"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "avatar"`);
    }

}
