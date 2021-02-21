import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeDecimalToRealFoodsTable1613946306288
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE foods
      ALTER COLUMN standard_quantity TYPE REAL,
      ALTER COLUMN energy_kcal TYPE REAL,
      ALTER COLUMN energy_kj TYPE REAL,
      ALTER COLUMN carbs TYPE REAL,
      ALTER COLUMN proteins TYPE REAL,
      ALTER COLUMN fats TYPE REAL
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE foods
      ALTER COLUMN standard_quantity TYPE DECIMAL,
      ALTER COLUMN energy_kcal TYPE DECIMAL,
      ALTER COLUMN energy_kj TYPE DECIMAL,
      ALTER COLUMN carbs TYPE DECIMAL,
      ALTER COLUMN proteins TYPE DECIMAL,
      ALTER COLUMN fats TYPE DECIMAL
      `);
  }
}
