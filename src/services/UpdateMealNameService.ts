import IMealsRepository from '../database/repositories/base/IMealsRepository';
import AppError from '../errors/AppError';
import Meal from '../models/Meal';

interface IRequest {
  mealId: string;
  userId: string;
  name: string;
}

export default class UpdateMealNameService {
  private mealsRepository: IMealsRepository;

  constructor(mealsRepository: IMealsRepository) {
    this.mealsRepository = mealsRepository;
  }

  public async execute({ mealId, userId, name }: IRequest): Promise<Meal> {
    const meal = await this.mealsRepository.findById(mealId);

    if (!meal) {
      throw new AppError('Meal not found', 404);
    }

    if (meal.user_id !== userId) {
      throw new AppError('You do not have permission to do this', 401);
    }

    meal.name = name;

    const savedMeal = await this.mealsRepository.save(meal);

    return savedMeal;
  }
}
