import IMealsRepository from '../database/repositories/base/IMealsRepository';
import AppError from '../errors/AppError';
import Meal from '../models/Meal';

interface IRequest {
  mealId: string;
  userId: string;
}

export default class DeleteMealByIdService {
  private mealsRepository: IMealsRepository;

  constructor(mealsRepository: IMealsRepository) {
    this.mealsRepository = mealsRepository;
  }

  public async execute({ mealId, userId }: IRequest): Promise<Meal> {
    const mealFound = await this.mealsRepository.findById(mealId);

    if (!mealFound) {
      throw new AppError('Meals does not exist', 400);
    }

    if (mealFound.user_id !== userId) {
      throw new AppError('Access denied.', 401);
    }

    await this.mealsRepository.deleteById(mealId);

    return mealFound;
  }
}
