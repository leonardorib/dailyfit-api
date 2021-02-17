import { Request, Response } from 'express';
import AddFoodToMealService from '../services/AddFoodToMealService';
import FoodsRepository from '../database/repositories/FoodsRepository';
import MealFoodsRepository from '../database/repositories/MealFoodsRepository';
import MealsRepository from '../database/repositories/MealsRepository';

export default class MealFoodsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const foodsRepository = new FoodsRepository();
    const mealFoodsRepository = new MealFoodsRepository();
    const mealsRepository = new MealsRepository();

    const addFoodToMeal = new AddFoodToMealService(
      mealFoodsRepository,
      foodsRepository,
      mealsRepository
    );

    const { mealId, foodId, quantity, quantity_unit } = request.body;

    try {
      const newMealFoodItem = await addFoodToMeal.execute({
        mealId,
        foodId,
        quantity,
        quantity_unit,
      });
      return response.json(newMealFoodItem);
    } catch (error) {
      console.log(error);
      return response.status(400).json({ error: error.message });
    }
  }
}
