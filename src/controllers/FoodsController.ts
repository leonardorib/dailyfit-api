import { Request, Response } from 'express';
import ListFoodsByNameService from '../services/ListFoodsByNameService';
import FoodsRepository from '../database/repositories/FoodsRepository';

export default class UsersController {
  public async list(request: Request, response: Response) {
    const { foodName } = request.body;

    const foodsRepository = new FoodsRepository();

    const listFoodsByName = new ListFoodsByNameService(foodsRepository);

    try {
      const foundFoods = await listFoodsByName.execute(foodName);

      return response.json(foundFoods);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}
