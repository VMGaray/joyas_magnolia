import { MigrationInterface, QueryRunner } from "typeorm";

export class SecurityUpdate1774912440199 implements MigrationInterface {
    name = 'SecurityUpdate1774912440199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" ADD "isVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "auth" ADD "registrationCode" character varying(6)`);
        await queryRunner.query(`ALTER TABLE "auth" ADD "registrationExpires" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "auth" ADD "tokenVersion" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "tokenVersion"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "registrationExpires"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "registrationCode"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "isVerified"`);
    }

}
