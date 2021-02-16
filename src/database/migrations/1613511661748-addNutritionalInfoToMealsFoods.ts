import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addNutritionalInfoToMealsFoods1613511661748
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('meals_foods', [
      new TableColumn({
        name: 'energy_kcal',
        type: 'decimal',
        isNullable: false,
      }),

      new TableColumn({
        name: 'energy_kj',
        type: 'decimal',
        isNullable: false,
      }),

      new TableColumn({
        name: 'carbs',
        type: 'decimal',
        isNullable: false,
      }),

      new TableColumn({
        name: 'proteins',
        type: 'decimal',
        isNullable: false,
      }),

      new TableColumn({
        name: 'fats',
        type: 'decimal',
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('meals_foods', 'energy_kcal');
    await queryRunner.dropColumn('meals_foods', 'energy_kj');
    await queryRunner.dropColumn('meals_foods', 'carbs');
    await queryRunner.dropColumn('meals_foods', 'proteins');
    await queryRunner.dropColumn('meals_foods', 'fats');
  }
}
