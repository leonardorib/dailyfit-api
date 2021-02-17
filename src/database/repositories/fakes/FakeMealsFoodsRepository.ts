import MealFood from '../../../models/MealFoods';
import IMealsFoodsRepository, {
  IMealFoodItemCreation,
} from '../base/IMealsFoodsRepository';
import { v4 as uuid } from 'uuid';

export default class FakeMealsFoodsRepository implements IMealsFoodsRepository {
  private fakeMealsFoods: MealFood[];

  constructor() {
    this.fakeMealsFoods = [];
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

    this.fakeMealsFoods.push(newMealFood);

    return newMealFood;
  }
}
