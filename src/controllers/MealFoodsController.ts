import { NextFunction, Request, Response } from 'express';

import FoodsRepository from '../database/repositories/FoodsRepository';
import MealFoodsRepository from '../database/repositories/MealFoodsRepository';
import MealsRepository from '../database/repositories/MealsRepository';

import AddFoodToMealService from '../services/AddFoodToMealService';
import DeleteMealFoodService from '../services/DeleteMealFoodService';
import UpdateMealFoodService from '../services/UpdateMealFoodService';

export default class MealFoodsController {
  public async create(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
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
      return next(error);
    }
  }

  public async update(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { userId } = request;
    const { mealFoodId } = request.params;
    const { foodId, quantity } = request.body;

    const mealFoodsRepository = new MealFoodsRepository();
    const mealsRepository = new MealsRepository();
    const foodsRepository = new FoodsRepository();

    const updateMealFoodService = new UpdateMealFoodService(
      mealFoodsRepository,
      mealsRepository,
      foodsRepository
    );

    try {
      const updatedMealFood = await updateMealFoodService.execute({
        mealFoodId,
        userId,
        foodId,
        quantity,
      });

      return response.json(updatedMealFood);
    } catch (error) {
      return next(error);
    }
  }

  public async delete(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { mealFoodId } = request.params;

    const mealFoodsRepository = new MealFoodsRepository();

    const deleteMealFood = new DeleteMealFoodService(mealFoodsRepository);

    try {
      const deletedMealFood = await deleteMealFood.execute(mealFoodId);

      return response.json(deletedMealFood);
    } catch (error) {
      return next(error);
    }
  }
}
