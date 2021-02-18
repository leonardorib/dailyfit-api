import MealFood from '../../../models/MealFoods';
import IMealsFoodsRepository, {
  IMealFoodItemCreation,
} from '../base/IMealsFoodsRepository';
import { v4 as uuid } from 'uuid';

export default class FakeMealsFoodsRepository implements IMealsFoodsRepository {
  private mealsFoods: MealFood[];

  constructor() {
    this.mealsFoods = [];
  }

  public async create({
    mealId,
    foodId,
    quantity,
    quantity_unit,
    energy_kcal,
    energy_kj,
    carbs,
    proteins,
    fats,
  }: IMealFoodItemCreation): Promise<MealFood> {
    const newMealFood = new MealFood();

    Object.assign(
      newMealFood,
      { id: uuid() },
      {
        meal_id: mealId,
        food_id: foodId,
        quantity,
        quantity_unit,
        energy_kcal,
        energy_kj,
        carbs,
        proteins,
        fats,
      }
    );

    this.mealsFoods.push(newMealFood);

    return newMealFood;
  }

  public async findById(mealFoodId: string): Promise<MealFood | undefined> {
    const mealFoodFound = this.mealsFoods.find(
      (mealFood) => mealFood.id === mealFoodId
    );

    return mealFoodFound;
  }

  public async deleteById(mealFoodId: string): Promise<MealFood | undefined> {
    const mealFound = this.mealsFoods.find(
      (mealFood) => mealFood.id === mealFoodId
    );

    this.mealsFoods = this.mealsFoods.filter(
      (mealFood) => mealFood.id !== mealFoodId
    );

    return mealFound;
  }

  public async listByMealId(mealId: string): Promise<MealFood[] | undefined> {
    const mealFoodFound = this.mealsFoods.filter(
      (mealFood) => mealFood.meal_id === mealId
    );

    return mealFoodFound;
  }
}
