import { Request, Response } from 'express';
import CreateMealService from '../services/CreateMealService';
import ListMealsByUserAndDate from '../services/ListMealsByUserAndDate';
import MealsRepository from '../database/repositories/MealsRepository';
import MealFoodsRepository from '../database/repositories/MealFoodsRepository';
import DeleteMealByIdService from '../services/DeleteMealByIdService';
import UpdateMealNameService from '../services/UpdateMealNameService';

export default class MealsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const mealsRepository = new MealsRepository();
    const createMeal = new CreateMealService(mealsRepository);

    const userId = request.userId;

    console.log(userId);

    const { name, date } = request.body;

    try {
      const meal = await createMeal.execute({ userId, name, date });

      return response.json(meal);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const userId = request.userId;
    const startDate = new Date(request.query.startDate as string);
    const endDate = new Date(request.query.endDate as string);

    const mealsRepository = new MealsRepository();
    const mealFoodsRepository = new MealFoodsRepository();
    const listMealsByUserAndDate = new ListMealsByUserAndDate(
      mealsRepository,
      mealFoodsRepository
    );

    try {
      const meals = await listMealsByUserAndDate.execute({
        userId,
        startDate,
        endDate,
      });

      return response.json(meals);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { userId } = request;
    const { mealId } = request.params;
    const { name } = request.body;

    const mealsRepository = new MealsRepository();
    const updateMealName = new UpdateMealNameService(mealsRepository);

    try {
      const updatedMeal = await updateMealName.execute({
        mealId,
        userId,
        name,
      });

      return response.json(updatedMeal);
    } catch (error) {
      return response.json({ error: error.message });
    }
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const userId = request.userId;

    const { mealId } = request.params;

    const mealsRepository = new MealsRepository();
    const deleteMealById = new DeleteMealByIdService(mealsRepository);

    try {
      const deletedMeal = await deleteMealById.execute({ mealId, userId });

      return response.json(deletedMeal);
    } catch (error) {
      return response.json({ error: error.message });
    }
  }
}
