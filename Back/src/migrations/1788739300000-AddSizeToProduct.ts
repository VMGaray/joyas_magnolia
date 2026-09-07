import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSizeToProduct1788739300000 implements MigrationInterface {
    name = 'AddSizeToProduct1788739300000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "size" character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "size"`);
    }

}
