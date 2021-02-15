import { Request, Response } from 'express';
import CreateMealService from '../services/CreateMealService';
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
}
