import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEventMetadata1735470013298 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE public.events
	SET metadata='{"module": "Meetings"}'::jsonb
	WHERE message_type LIKE '%Meeting%';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE public.events
	SET metadata='{}'::jsonb
	WHERE message_type LIKE '%Meeting%';
    `);
  }
}
