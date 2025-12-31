import { MigrationInterface, QueryRunner } from "typeorm";

export class Cambio11766948240641 implements MigrationInterface {
    name = 'Cambio11766948240641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_374bfd0d1b0e1398d7206456d98"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_683e14f40db25cb93a778ccca04"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "productTypeId"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "subtypeId"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "stock" integer NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."product_category_enum" AS ENUM('Plata 925', 'Oro 18k', 'Enchapados', 'Personalizados', 'Insumos')`);
        await queryRunner.query(`ALTER TABLE "product" ADD "category" "public"."product_category_enum" NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."product_producttype_enum" AS ENUM('Anillos', 'Aros', 'Cadenas', 'Dijes', 'Pulseras', 'Conjuntos', 'Combos')`);
        await queryRunner.query(`ALTER TABLE "product" ADD "productType" "public"."product_producttype_enum" NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."product_rings_subtype_enum" AS ENUM('Piedras naturales', 'Cubic y micropave', 'Cristal SW', 'Plata lisa', 'Elastizados', 'Niolis', 'Inflados', 'Nacar y perlas', 'Plata y oro')`);
        await queryRunner.query(`ALTER TABLE "product" ADD "rings_subtype" "public"."product_rings_subtype_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."product_earrings_subtype_enum" AS ENUM('Argollas', 'Colgantes', 'Pasantes', 'Abridores', 'Inflados', 'Con dijes', 'Cuff', 'Trepadores', 'Plata y oro', 'Otros')`);
        await queryRunner.query(`ALTER TABLE "product" ADD "earrings_subtype" "public"."product_earrings_subtype_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."product_chains_subtype_enum" AS ENUM('Denarios y rosarios', 'Exclusivas e importante', 'Finas y clasicas', 'Nacar y perlas', 'Piedras', 'Trenzas', 'Cristales', 'Gamuza', 'Con dijes', 'Otras', 'Hombres')`);
        await queryRunner.query(`ALTER TABLE "product" ADD "chains_subtype" "public"."product_chains_subtype_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."product_bracelets_subtype_enum" AS ENUM('Exclusivas e importadas', 'Piedras naturales', 'Elastizadas', 'Plata lisa', 'Nacar y perla', 'Cristales', 'Cubic y micro', 'Esclavas', 'Con dijes', 'Gamuzas y cueros', 'Plata y oro', 'Hombres')`);
        await queryRunner.query(`ALTER TABLE "product" ADD "bracelets_subtype" "public"."product_bracelets_subtype_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."product_pendants_subtype_enum" AS ENUM('Para grabar', 'Cristales', 'Religiosos', 'Esmaltados', 'Exclusivos e importantes', 'Piedras', 'Inflados', 'Cubic y micro', 'Liso', 'Iniciales', 'Otros')`);
        await queryRunner.query(`ALTER TABLE "product" ADD "pendants_subtype" "public"."product_pendants_subtype_enum"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "quantity" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "description" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "pendants_subtype"`);
        await queryRunner.query(`DROP TYPE "public"."product_pendants_subtype_enum"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "bracelets_subtype"`);
        await queryRunner.query(`DROP TYPE "public"."product_bracelets_subtype_enum"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "chains_subtype"`);
        await queryRunner.query(`DROP TYPE "public"."product_chains_subtype_enum"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "earrings_subtype"`);
        await queryRunner.query(`DROP TYPE "public"."product_earrings_subtype_enum"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "rings_subtype"`);
        await queryRunner.query(`DROP TYPE "public"."product_rings_subtype_enum"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "productType"`);
        await queryRunner.query(`DROP TYPE "public"."product_producttype_enum"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "category"`);
        await queryRunner.query(`DROP TYPE "public"."product_category_enum"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "stock"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "subtypeId" integer`);
        await queryRunner.query(`ALTER TABLE "product" ADD "productTypeId" integer`);
        await queryRunner.query(`ALTER TABLE "product" ADD "categoryId" integer`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_683e14f40db25cb93a778ccca04" FOREIGN KEY ("subtypeId") REFERENCES "subtype"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_374bfd0d1b0e1398d7206456d98" FOREIGN KEY ("productTypeId") REFERENCES "product_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
