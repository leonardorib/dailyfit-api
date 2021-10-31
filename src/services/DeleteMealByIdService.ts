import IMealsRepository from '../database/repositories/base/IMealsRepository';
import AppError from '../errors/AppError';
import Meal from '../models/Meal';

interface IRequest {
  mealId: string;
  userId: string;
}

interface IResponse extends Meal {
  energy_kcal: number;
  energy_kj: number;
  carbs: number;
  proteins: number;
  fats: number;
}

export default class DeleteMealByIdService {
  private mealsRepository: IMealsRepository;

  constructor(mealsRepository: IMealsRepository) {
    this.mealsRepository = mealsRepository;
  }

  public async execute({ mealId, userId }: IRequest): Promise<IResponse> {
    const mealFound = await this.mealsRepository.findById(mealId);

    if (!mealFound) {
      throw new AppError('Meals was not found', 404);
    }

    if (mealFound.user_id !== userId) {
      throw new AppError('Access denied.', 401);
    }

	const nutrients = {
		energy_kcal: 0,
		energy_kj: 0,
		carbs: 0,
		proteins: 0,
		fats: 0,
	  };

    mealFound.mealFoods.length > 0 &&
      mealFound.mealFoods.forEach((food) => {
        nutrients.energy_kcal += food.energy_kcal;
        nutrients.energy_kj += food.energy_kj;
        nutrients.carbs += food.carbs;
        nutrients.proteins += food.proteins;
        nutrients.fats += food.fats;
      });

    await this.mealsRepository.deleteById(mealId);

    return { ...mealFound, ...nutrients };
  }
}
