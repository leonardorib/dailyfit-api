import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createFoodsTable1612459396710 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'foods',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'standard_quantity',
            type: 'decimal',
            isNullable: false,
          },
          {
            name: 'standard_quantity_unit',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'energy_kcal',
            type: 'decimal',
            isNullable: false,
          },
          {
            name: 'energy_kj',
            type: 'decimal',
            isNullable: false,
          },
          {
            name: 'carbs',
            type: 'decimal',
            isNullable: false,
          },
          {
            name: 'proteins',
            type: 'decimal',
            isNullable: false,
          },
          {
            name: 'fats',
            type: 'decimal',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('foods');
  }
}
