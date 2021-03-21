import { NextFunction, Request, Response } from 'express';
import ListFoodsByNameService from '../services/ListFoodsByNameService';
import FoodsRepository from '../database/repositories/FoodsRepository';

export default class UsersController {
  public async list(request: Request, response: Response, next: NextFunction) {
    const { foodName } = request.query;

    const foodsRepository = new FoodsRepository();

    const listFoodsByName = new ListFoodsByNameService(foodsRepository);

    try {
      const foundFoods = await listFoodsByName.execute(foodName as string);

      return response.json(foundFoods);
    } catch (error) {
      return next(error);
    }
  }
}
