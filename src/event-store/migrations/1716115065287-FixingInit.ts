import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixingInit1716115065287 implements MigrationInterface {
  name = 'FixingInit1716115065287';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "events" ("globalPosition" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, "messageId" character varying NOT NULL, "messageType" character varying NOT NULL, "streamId" character varying NOT NULL, "streamPosition" bigint NOT NULL, "data" jsonb NOT NULL, "metadata" jsonb NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_ac8b2289f1fa9de317345954bc0" PRIMARY KEY ("globalPosition"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "events"`);
  }
}
