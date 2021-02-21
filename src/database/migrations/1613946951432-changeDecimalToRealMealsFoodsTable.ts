import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeDecimalToRealMealsFoodsTable1613946951432
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE meals_foods
      ALTER COLUMN quantity TYPE REAL,
      ALTER COLUMN energy_kcal TYPE REAL,
      ALTER COLUMN energy_kj TYPE REAL,
      ALTER COLUMN carbs TYPE REAL,
      ALTER COLUMN proteins TYPE REAL,
      ALTER COLUMN fats TYPE REAL
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE meals_foods
      ALTER COLUMN quantity TYPE DECIMAL,
      ALTER COLUMN energy_kcal TYPE DECIMAL,
      ALTER COLUMN energy_kj TYPE DECIMAL,
      ALTER COLUMN carbs TYPE DECIMAL,
      ALTER COLUMN proteins TYPE DECIMAL,
      ALTER COLUMN fats TYPE DECIMAL
      `);
  }
}
