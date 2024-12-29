import { MigrationInterface, QueryRunner } from 'typeorm';

export class ImagesInit1735497313611 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "images" (
        "id" uuid PRIMARY KEY,
        "key" varchar NOT NULL,
        "user_id" uuid NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "images_key_idx" ON "images" ("key")
    `);

    await queryRunner.query(`
      CREATE INDEX "images_user_id_idx" ON "images" ("user_id")
    `);

    await queryRunner.query(
      `CREATE INDEX "images_key_user_id_idx" ON "images" ("key", "user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "images_key_user_id_idx"`);
    await queryRunner.query(`DROP INDEX "images_user_id_idx"`);
    await queryRunner.query(`DROP INDEX "images_key_idx"`);

    await queryRunner.query(`DROP TABLE "images"`);
  }
}
