import IMealsRepository, {
  IMealListByUserAndDate,
} from '../database/repositories/base/IMealsRepository';

import IMealsFoodsRepository from '../database/repositories/base/IMealsFoodsRepository';
import MealFoods from '../models/MealFoods';
import Meal from '../models/Meal';

interface IMealWithFoods extends Meal {
  mealsFoods?: MealFoods[];
}

export default class ListMealsByUserAndDate {
  private mealsRepository: IMealsRepository;
  private mealsFoodsRepository: IMealsFoodsRepository;

  constructor(
    mealsRepository: IMealsRepository,
    mealsFoodsRepository: IMealsFoodsRepository
  ) {
    this.mealsRepository = mealsRepository;
    this.mealsFoodsRepository = mealsFoodsRepository;
  }

  public async execute({ userId, startDate, endDate }: IMealListByUserAndDate) {
    const meals = await this.mealsRepository.listByUserAndDate({
      userId,
      startDate,
      endDate,
    });

    const mealsFoodArraysPromises = meals.map((meal) => {
      return this.mealsFoodsRepository.listByMealId(meal.id);
    });

    const mealsFoodArrays = await Promise.all(mealsFoodArraysPromises);

    const mealsWithFoodItems = meals.map((meal) => ({
      ...(meal as Meal),
      foods: [] as MealFoods[],
    }));

    mealsWithFoodItems.forEach((meal) => {
      mealsFoodArrays.forEach((mealFoodArray) => {
        if (mealFoodArray.length > 0 && mealFoodArray[0].meal_id === meal.id) {
          meal.foods = mealFoodArray;
        }
      });
    });

    return mealsWithFoodItems;
  }
}
