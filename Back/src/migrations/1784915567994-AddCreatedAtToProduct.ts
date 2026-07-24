import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtToProduct1784915567994 implements MigrationInterface {
    name = 'AddCreatedAtToProduct1784915567994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "createdAt"`);
    }

}
