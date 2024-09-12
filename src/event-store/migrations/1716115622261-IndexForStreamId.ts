import { MigrationInterface, QueryRunner } from 'typeorm';

export class IndexForStreamId1716115622261 implements MigrationInterface {
  name = 'IndexForStreamId1716115622261';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "UQ_a47f9d401b39cc1f8758025b18c" UNIQUE ("messageId")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "message_id_idx" ON "events" ("messageId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "stream_id_idx" ON "events" ("streamId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "timestamp_idx" ON "events" ("timestamp") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."timestamp_idx"`);
    await queryRunner.query(`DROP INDEX "public"."stream_id_idx"`);
    await queryRunner.query(`DROP INDEX "public"."message_id_idx"`);
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "UQ_a47f9d401b39cc1f8758025b18c"`,
    );
  }
}
