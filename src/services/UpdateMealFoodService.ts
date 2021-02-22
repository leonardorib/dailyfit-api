import IMealsFoodsRepository from '../database/repositories/base/IMealsFoodsRepository';
import IMealsRepository from '../database/repositories/base/IMealsRepository';
import IFoodsRepository from '../database/repositories/base/IFoodsRepository';
import AppError from '../errors/AppError';
import MealFoods from '../models/MealFoods';

interface IRequest {
  mealFoodId: string;
  userId: string;
  foodId?: string;
  quantity?: number;
}

export default class UpdateMealFoodService {
  private mealsFoodsRepository: IMealsFoodsRepository;
  private mealsRepository: IMealsRepository;
  private foodsRepository: IFoodsRepository;

  constructor(
    mealsFoodsRepository: IMealsFoodsRepository,
    mealsRepository: IMealsRepository,
    foodsRepository: IFoodsRepository
  ) {
    this.mealsFoodsRepository = mealsFoodsRepository;
    this.mealsRepository = mealsRepository;
    this.foodsRepository = foodsRepository;
  }

  public async execute({ mealFoodId, userId, foodId, quantity }: IRequest) {
    const mealFood = await this.mealsFoodsRepository.findById(mealFoodId);

    if (!mealFood) {
      throw new AppError('Resource not found', 404);
    }

    const meal = await this.mealsRepository.findById(mealFood.meal_id);

    if (meal.user_id !== userId) {
      throw new AppError('You do not have permissions', 401);
    }

    const food = await this.foodsRepository.findById(
      foodId ? foodId : mealFood.food_id
    );

    let proportionFactor = mealFood.quantity / food.standard_quantity;

    if (quantity) {
      proportionFactor = quantity / food.standard_quantity;
      mealFood.quantity = quantity;
    }

    mealFood.food_id = food.id;
    mealFood.name = food.name;
    mealFood.energy_kcal = proportionFactor * food.energy_kcal;
    mealFood.energy_kj = proportionFactor * food.energy_kj;
    mealFood.carbs = proportionFactor * food.carbs;
    mealFood.proteins = proportionFactor * food.proteins;
    mealFood.fats = proportionFactor * food.fats;

    const updatedMealFood = await this.mealsFoodsRepository.save(mealFood);

    return updatedMealFood;
  }
}
