import IMealsFoodsRepository from '../database/repositories/base/IMealsFoodsRepository';
import AppError from '../errors/AppError';

interface IRequest {
  mealFoodId: string;
}

interface INutrients {
	energy_kcal: number;
	energy_kj: number;
	carbs: number;
	proteins: number;
	fats: number;
}

export default class ListMealsByUserAndDate {
  private mealFoodsRepository: IMealsFoodsRepository;

  constructor(
    mealFoodsRepository: IMealsFoodsRepository,
  ) {
    this.mealFoodsRepository = mealFoodsRepository;
  }

  public async execute(request: IRequest) {
    const { mealFoodId } = request;

    const mealFood = await this.mealFoodsRepository.findById(mealFoodId);

    if (!mealFood) {
      throw new AppError('Meal food does not exist', 400);
    }

	return mealFood;
  }
}
