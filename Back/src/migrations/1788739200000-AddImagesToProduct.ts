import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImagesToProduct1788739200000 implements MigrationInterface {
    name = 'AddImagesToProduct1788739200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "images" text`);
        // Sembramos la galería con la portada actual para no perder las fotos ya cargadas.
        await queryRunner.query(`UPDATE "product" SET "images" = "imageUrl" WHERE "imageUrl" IS NOT NULL AND "imageUrl" <> ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "images"`);
    }

}
