import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class ImagesInit1735550015334 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the 'images' table
    await queryRunner.createTable(
      new Table({
        name: 'images',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'key',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'images',
      new TableIndex({
        name: 'images_key_idx',
        columnNames: ['key'],
      }),
    );

    await queryRunner.createIndex(
      'images',
      new TableIndex({
        name: 'images_user_id_idx',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'images',
      new TableIndex({
        name: 'images_key_user_id_idx',
        columnNames: ['key', 'user_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('images', 'images_key_user_id_idx');
    await queryRunner.dropIndex('images', 'images_user_id_idx');
    await queryRunner.dropIndex('images', 'images_key_idx');

    // Drop the table
    await queryRunner.dropTable('images');
  }
}
