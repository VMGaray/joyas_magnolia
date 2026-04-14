import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1776180448652 implements MigrationInterface {
    name = 'InitialSchema1776180448652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "price" numeric(10,2) NOT NULL, "orderId" uuid, "productId" uuid, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'processed', 'shipped', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_shippingmethod_enum" AS ENUM('nacional', 'calamuchita', 'vgb')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "totalPrice" numeric(10,2) NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending', "shippingMethod" "public"."orders_shippingmethod_enum" NOT NULL DEFAULT 'nacional', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "shippingAddress" character varying(255), "shippingCity" character varying(100), "shippingZipCode" character varying(20), "shippingState" character varying(100), "recipientPhone" character varying(20), "recipientName" character varying(150), "userId" uuid, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(50) NOT NULL, "phone" bigint NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(100) NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "address" character varying(150), "city" character varying(100), "zipCode" character varying(20), "state" character varying(100), "resetPasswordCode" character varying(6), "resetPasswordExpires" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "blockedAt" TIMESTAMP, "isVerified" boolean NOT NULL DEFAULT false, "registrationCode" character varying(6), "registrationExpires" TIMESTAMP, "tokenVersion" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_ratings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" integer NOT NULL, "comment" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" uuid, "userId" uuid, CONSTRAINT "PK_f8bd94404fc1d160bdb075dc435" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."product_category_enum" AS ENUM('Plata 925', 'Oro 18k', 'Enchapados', 'Personalizados', 'Insumos')`);
        await queryRunner.query(`CREATE TYPE "public"."product_producttype_enum" AS ENUM('Anillos', 'Aros', 'Cadenas', 'Dijes', 'Pulseras', 'Conjuntos', 'Combos')`);
        await queryRunner.query(`CREATE TYPE "public"."product_rings_subtype_enum" AS ENUM('Piedras naturales', 'Cubic y micropave', 'Cristal SW', 'Plata lisa', 'Elastizados', 'Niolis', 'Inflados', 'Nacar y perlas', 'Plata y oro')`);
        await queryRunner.query(`CREATE TYPE "public"."product_earrings_subtype_enum" AS ENUM('Argollas', 'Colgantes', 'Pasantes', 'Abridores', 'Inflados', 'Con dijes', 'Cuff', 'Trepadores', 'Plata y oro', 'Otros')`);
        await queryRunner.query(`CREATE TYPE "public"."product_chains_subtype_enum" AS ENUM('Denarios y rosarios', 'Exclusivas e importante', 'Finas y clasicas', 'Nacar y perlas', 'Piedras', 'Trenzas', 'Cristales', 'Gamuza', 'Con dijes', 'Otras', 'Hombres')`);
        await queryRunner.query(`CREATE TYPE "public"."product_bracelets_subtype_enum" AS ENUM('Exclusivas e importadas', 'Piedras naturales', 'Elastizadas', 'Plata lisa', 'Nacar y perla', 'Cristales', 'Cubic y micro', 'Esclavas', 'Con dijes', 'Gamuzas y cueros', 'Plata y oro', 'Hombres')`);
        await queryRunner.query(`CREATE TYPE "public"."product_pendants_subtype_enum" AS ENUM('Para grabar', 'Cristales', 'Religiosos', 'Esmaltados', 'Exclusivos e importantes', 'Piedras', 'Inflados', 'Cubic y micro', 'Liso', 'Iniciales', 'Otros')`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text NOT NULL, "price" numeric NOT NULL, "stock" integer NOT NULL, "isFeatured" boolean, "averageRating" numeric(3,2), "ratingCount" integer NOT NULL DEFAULT '0', "imageUrl" text, "category" "public"."product_category_enum" NOT NULL, "productType" "public"."product_producttype_enum" NOT NULL, "rings_subtype" "public"."product_rings_subtype_enum", "earrings_subtype" "public"."product_earrings_subtype_enum", "chains_subtype" "public"."product_chains_subtype_enum", "bracelets_subtype" "public"."product_bracelets_subtype_enum", "pendants_subtype" "public"."product_pendants_subtype_enum", "tags" text, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'pending', "externalReference" character varying(100), "paymentId" character varying(100), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "orderId" uuid, CONSTRAINT "REL_af929a5f2a400fdb6913b4967e" UNIQUE ("orderId"), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "auth"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_ratings" ADD CONSTRAINT "FK_1755b3b00e1d9f8cad4632324db" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_ratings" ADD CONSTRAINT "FK_a5deb28a53d34567cb691f8f3c3" FOREIGN KEY ("userId") REFERENCES "auth"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1" FOREIGN KEY ("userId") REFERENCES "auth"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_af929a5f2a400fdb6913b4967e1" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_af929a5f2a400fdb6913b4967e1"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1"`);
        await queryRunner.query(`ALTER TABLE "product_ratings" DROP CONSTRAINT "FK_a5deb28a53d34567cb691f8f3c3"`);
        await queryRunner.query(`ALTER TABLE "product_ratings" DROP CONSTRAINT "FK_1755b3b00e1d9f8cad4632324db"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_cdb99c05982d5191ac8465ac010"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TYPE "public"."product_pendants_subtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."product_bracelets_subtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."product_chains_subtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."product_earrings_subtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."product_rings_subtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."product_producttype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."product_category_enum"`);
        await queryRunner.query(`DROP TABLE "product_ratings"`);
        await queryRunner.query(`DROP TABLE "auth"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_shippingmethod_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
    }

}
