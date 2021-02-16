import { Request, Response } from 'express';
import CreateMealService from '../services/CreateMealService';
import ListMealsByUserAndDate from '../services/ListMealsByUserAndDate';
import MealsRepository from '../database/repositories/MealsRepository';

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
    const listMealsByUserAndDate = new ListMealsByUserAndDate(mealsRepository);

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
}
