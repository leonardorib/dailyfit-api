import Food from '../models/Food';
import IFoodsRepository from '../database/repositories/base/IFoodsRepository';

export default class ListFoodsByNameService {
  private foodsRepository: IFoodsRepository;

  constructor(foodsRepository: IFoodsRepository) {
    this.foodsRepository = foodsRepository;
  }

  public async execute(foodName: string): Promise<Food[] | undefined> {
    const foundFoods = await this.foodsRepository.listByName(foodName);

    return foundFoods;
  }
}
