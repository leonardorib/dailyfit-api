import IFoodsRepository from './base/IFoodsRepository';
import { getRepository, Repository, Like } from 'typeorm';
import Food from '../../models/Food';

export default class FoodsRepository implements IFoodsRepository {
  private ormRepository: Repository<Food>;

  constructor() {
    this.ormRepository = getRepository(Food);
  }

  public async listByName(foodName: string): Promise<Food[] | undefined> {
    const foundFoods = await this.ormRepository
      .createQueryBuilder('foods')
      .where('LOWER(name) LIKE :foodName', {
        foodName: `%${foodName.toLowerCase()}%`,
      })
      .getMany();

    return foundFoods;
  }
}
