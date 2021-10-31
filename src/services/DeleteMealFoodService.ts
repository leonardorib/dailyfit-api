import MealFood from '../models/MealFoods';
import IMealsFoodsRepository from '../database/repositories/base/IMealsFoodsRepository';
import AppError from '../errors/AppError';

export default class DeleteMealFoodService {
  private mealFoodsRepository: IMealsFoodsRepository;

  constructor(mealFoodsRepository: IMealsFoodsRepository) {
    this.mealFoodsRepository = mealFoodsRepository;
  }

  public async execute(mealFoodId: string): Promise<MealFood> {
    const mealFood = await this.mealFoodsRepository.findById(mealFoodId);

    if (!mealFood) {
      throw new AppError('Meal food item was not found', 404);
    }

    const deletedMealFood = await this.mealFoodsRepository.deleteById(
      mealFoodId
    );

    return deletedMealFood;
  }
}
