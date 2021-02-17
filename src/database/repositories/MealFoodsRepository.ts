import { getRepository, Repository } from 'typeorm';
import MealFood from '../../models/MealFoods';
import IMealsFoodsRepository, {
  IMealFoodItemCreation,
} from './base/IMealsFoodsRepository';

export default class MealFoodsRepository implements IMealsFoodsRepository {
  private ormRepository: Repository<MealFood>;

  constructor() {
    this.ormRepository = getRepository(MealFood);
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
    const newMealFoodItem = this.ormRepository.create({
      meal_id: mealId,
      food_id: foodId,
      quantity,
      quantity_unit,
      energy_kcal,
      energy_kj,
      carbs,
      proteins,
      fats,
    });

    await this.ormRepository.save(newMealFoodItem);

    return newMealFoodItem;
  }
}
