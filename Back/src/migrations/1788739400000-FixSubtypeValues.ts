import { MigrationInterface, QueryRunner } from "typeorm";

// Correcciones de texto en los subtipos:
// - Cadenas: "Trenzas" estaba mal escrito, va "Tanzas".
// - Anillos: "Niolis" era un valor erroneo, se elimina.
export class FixSubtypeValues1788739400000 implements MigrationInterface {
    name = 'FixSubtypeValues1788739400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // --- Cadenas: renombrar el valor del enum (arrastra las filas existentes) ---
        await queryRunner.query(`ALTER TYPE "public"."product_chains_subtype_enum" RENAME VALUE 'Trenzas' TO 'Tanzas'`);

        // --- Anillos: quitar 'Niolis' del enum ---
        // Postgres no permite borrar un valor de un enum: recreamos el tipo sin 'Niolis'.
        await queryRunner.query(`UPDATE "product" SET "rings_subtype" = NULL WHERE "rings_subtype" = 'Niolis'`);
        await queryRunner.query(`ALTER TYPE "public"."product_rings_subtype_enum" RENAME TO "product_rings_subtype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."product_rings_subtype_enum" AS ENUM('Piedras naturales', 'Cubic y micropave', 'Cristal SW', 'Plata lisa', 'Elastizados', 'Inflados', 'Nacar y perlas', 'Plata y oro')`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "rings_subtype" TYPE "public"."product_rings_subtype_enum" USING "rings_subtype"::"text"::"public"."product_rings_subtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."product_rings_subtype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."product_rings_subtype_enum" RENAME TO "product_rings_subtype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."product_rings_subtype_enum" AS ENUM('Piedras naturales', 'Cubic y micropave', 'Cristal SW', 'Plata lisa', 'Elastizados', 'Niolis', 'Inflados', 'Nacar y perlas', 'Plata y oro')`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "rings_subtype" TYPE "public"."product_rings_subtype_enum" USING "rings_subtype"::"text"::"public"."product_rings_subtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."product_rings_subtype_enum_old"`);

        await queryRunner.query(`ALTER TYPE "public"."product_chains_subtype_enum" RENAME VALUE 'Tanzas' TO 'Trenzas'`);
    }

}
