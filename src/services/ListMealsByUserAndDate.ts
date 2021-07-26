import IMealsRepository, {
  IMealListByUserAndDate,
} from '../database/repositories/base/IMealsRepository';

import Meal from '../models/Meal';
export default class ListMealsByUserAndDate {
  private mealsRepository: IMealsRepository;

  constructor(
    mealsRepository: IMealsRepository,
  ) {
    this.mealsRepository = mealsRepository;
  }

  public async execute({ userId, startDate, endDate }: IMealListByUserAndDate) {
    const meals = await this.mealsRepository.listByUserAndDate({
      userId,
      startDate,
      endDate,
    });

    const mealsWithNutrients = meals.map((meal) => ({
      ...(meal as Meal),
      energy_kcal: 0 as number,
      energy_kj: 0 as number,
      carbs: 0 as number,
      proteins: 0 as number,
      fats: 0 as number,
    }));

    const response = {
      energy_kcal: 0,
      energy_kj: 0,
      carbs: 0,
      proteins: 0,
      fats: 0,
      meals: [],
    };

    mealsWithNutrients.forEach((meal) => {
      meal.mealFoods.forEach((mealFood) => {
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
    });

    response.meals = mealsWithNutrients;

    return response;
  }
}
