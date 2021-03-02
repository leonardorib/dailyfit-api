import IFoodsRepository from './base/IFoodsRepository';
import { getRepository, Repository, Like } from 'typeorm';
import Food from '../../models/Food';

export default class FoodsRepository implements IFoodsRepository {
  private ormRepository: Repository<Food>;

  constructor() {
    this.ormRepository = getRepository(Food);
  }

  public async findById(foodId: string): Promise<Food | undefined> {
    const foundFood = await this.ormRepository.findOne(foodId);

    return foundFood;
  }

  public async listByName(foodName: string): Promise<Food[] | undefined> {
    const foundFoods = await this.ormRepository
      .createQueryBuilder('foods')
      .where(
        `REPLACE(REPLACE(unaccent(LOWER(name)),', ',''),' ','') LIKE :foodName`,
        {
          foodName: `%${foodName
            .toLowerCase()
            .replace(/ /g, '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')}%`,
        }
      )
      .getMany();

    return foundFoods;
  }
}
