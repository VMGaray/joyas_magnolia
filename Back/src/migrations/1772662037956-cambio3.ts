import { MigrationInterface, QueryRunner } from "typeorm";

export class Cambio31772662037956 implements MigrationInterface {
    name = 'Cambio31772662037956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" ADD "resetPasswordCode" character varying(6)`);
        await queryRunner.query(`ALTER TABLE "auth" ADD "resetPasswordExpires" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "resetPasswordExpires"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "resetPasswordCode"`);
    }

}
