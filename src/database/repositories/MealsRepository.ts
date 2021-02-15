import { getRepository, Repository } from 'typeorm';
import Meal from '../../models/Meal';
import IMealsRepository, {
  IMealCreation,
  IMealListByUserAndDate,
} from './base/IMealsRepository';

export default class MealsRepository implements IMealsRepository {
  private ormRepository: Repository<Meal>;

  constructor() {
    this.ormRepository = getRepository(Meal);
  }

  public async create({ userId, name, date }: IMealCreation) {
    const meal = this.ormRepository.create({ user_id: userId, name, date });

    await this.ormRepository.save(meal);

    return meal;
  }
}
