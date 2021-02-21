import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addFoodNameColumnToMealFoods1613950269058
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('meals_foods', [
      new TableColumn({
        name: 'name',
        type: 'varchar',
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('meals_foods', 'name');
  }
}
