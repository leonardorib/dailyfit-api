import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createMealsFoods1612474889955 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'meals_foods',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'meal_id',
            type: 'uuid',
          },
          {
            name: 'food_id',
            type: 'uuid',
          },
          {
            name: 'quantity',
            type: 'decimal',
          },
          {
            name: 'quantity_unit',
            type: 'varchar',
            default: "'g'",
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
        foreignKeys: [
          {
            name: 'MealFoodsMeals',
            referencedTableName: 'meals',
            referencedColumnNames: ['id'],
            columnNames: ['meal_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          },
          {
            name: 'MealFoods',
            referencedTableName: 'foods',
            referencedColumnNames: ['id'],
            columnNames: ['food_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          }
        ]
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('meals_foods', 'MealFoodsMeals');
    await queryRunner.dropForeignKey('meals_foods', 'MealFoods');
    await queryRunner.dropTable('meals_foods');
  }
}
