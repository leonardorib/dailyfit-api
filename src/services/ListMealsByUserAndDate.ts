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
      energy_kcal: 0 as number,
      energy_kj: 0 as number,
      carbs: 0 as number,
      proteins: 0 as number,
      fats: 0 as number,
      foods: [] as MealFoods[],
    }));

    const response = {
      energy_kcal: 0,
      energy_kj: 0,
      carbs: 0,
      proteins: 0,
      fats: 0,
      meals: [],
    };

    // Adds foods list array to it's corresponding meal and calculate calories and nutrients of the meal
    mealsWithFoodItems.forEach((meal) => {
      mealsFoodArrays.forEach((mealFoodArray) => {
        if (mealFoodArray.length > 0 && mealFoodArray[0].meal_id === meal.id) {
          meal.foods = mealFoodArray;

          mealFoodArray.forEach((mealFood) => {
            meal.energy_kcal =
              Math.round((meal.energy_kcal + mealFood.energy_kcal) * 100) / 100;
            meal.energy_kj += mealFood.energy_kj;
            meal.carbs += mealFood.carbs;
            meal.proteins += mealFood.proteins;
            meal.fats += mealFood.fats;
          });

          response.energy_kcal += meal.energy_kcal;
          response.energy_kj += meal.energy_kj;
          response.carbs += meal.carbs;
          response.proteins += meal.proteins;
          response.fats += meal.fats;
        }
      });
    });

    response.meals = mealsWithFoodItems;

    return response;
  }
}
