import IFoodsRepository from '../database/repositories/base/IFoodsRepository';
import IMealsFoodsRepository from '../database/repositories/base/IMealsFoodsRepository';
import IMealsRepository from '../database/repositories/base/IMealsRepository';
import AppError from '../errors/AppError';
import Meal from '../models/Meal';
import MealFoods from '../models/MealFoods';

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
  private mealFoodsRepository: IMealsFoodsRepository;

  constructor(
    mealsRepository: IMealsRepository,
    mealFoodsRepository: IMealsFoodsRepository
  ) {
    this.mealsRepository = mealsRepository;
    this.mealFoodsRepository = mealFoodsRepository;
  }

  public async execute({ mealId, userId }: IRequest): Promise<IResponse> {
    const mealFound = await this.mealsRepository.findById(mealId);

    const foods =
      (await this.mealFoodsRepository.listByMealId(mealId)) ||
      ([] as MealFoods[]);

    const nutrients = {
      energy_kcal: 0,
      energy_kj: 0,
      carbs: 0,
      proteins: 0,
      fats: 0,
    };

    foods.length > 0 &&
      foods.forEach((food) => {
        nutrients.energy_kcal += food.energy_kcal;
        nutrients.energy_kj += food.energy_kj;
        nutrients.carbs += food.carbs;
        nutrients.proteins += food.proteins;
        nutrients.fats += food.fats;
      });

    if (!mealFound) {
      throw new AppError('Meals does not exist', 400);
    }

    if (mealFound.user_id !== userId) {
      throw new AppError('Access denied.', 401);
    }

    await this.mealsRepository.deleteById(mealId);

    return { ...mealFound, ...nutrients };
  }
}
