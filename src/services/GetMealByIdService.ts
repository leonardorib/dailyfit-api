import IMealsRepository from '../database/repositories/base/IMealsRepository';
import AppError from '../errors/AppError';
import Meal from '../models/Meal';
import MealFoods from '../models/MealFoods';

interface IRequest {
  mealId: string;
  userId: string;
}

interface INutrients {
	energy_kcal: number;
	energy_kj: number;
	carbs: number;
	proteins: number;
	fats: number;
}

interface IResponse extends Meal {
	foods: MealFoods[];
	nutrients: INutrients;
}

export default class ListMealsByUserAndDate {
  private mealsRepository: IMealsRepository;

  constructor(
    mealsRepository: IMealsRepository,
  ) {
    this.mealsRepository = mealsRepository;
  }

  public async execute(request: IRequest) {
    const { mealId, userId } = request;

    const meal = await this.mealsRepository.findById(mealId);

    if (!meal) {
      throw new AppError('Meal does not exist', 404);
    }

    if (meal.user_id !== userId) {
      throw new AppError('Not allowed', 401);
    }

	let nutrients: INutrients = {
		energy_kcal: 0,
		energy_kj: 0,
		carbs: 0,
		proteins: 0,
		fats: 0,
	}

	meal.mealFoods.forEach(food => {
		nutrients = {
			energy_kcal: nutrients.energy_kcal + food.energy_kcal,
			energy_kj: nutrients.energy_kj + food.energy_kj,
			carbs: nutrients.carbs + food.carbs,
			proteins: nutrients.proteins + food.proteins,
			fats: nutrients.fats + food.fats,
		}
	})

	return {
		...meal,
		...nutrients,
	}
  }
}
