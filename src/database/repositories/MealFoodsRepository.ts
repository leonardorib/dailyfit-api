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

  public async findById(mealFoodId: string) {
    const mealFound = await this.ormRepository.findOne(mealFoodId);

    return mealFound;
  }

  public async deleteById(mealFoodId: string) {
    const mealFoodFound = await this.ormRepository.findOne(mealFoodId);

    await this.ormRepository.remove(mealFoodFound);

    return mealFoodFound;
  }

  public async listByMealId(mealId: string): Promise<MealFood[] | undefined> {
    const mealFoodFound = await this.ormRepository.find({
      where: { meal_id: mealId },
    });

    return mealFoodFound;
  }
}
