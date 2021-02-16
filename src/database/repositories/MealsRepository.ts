import { getRepository, MoreThanOrEqual, Repository } from 'typeorm';
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

  public async create({ userId, name, date }: IMealCreation): Promise<Meal> {
    const meal = this.ormRepository.create({ user_id: userId, name, date });

    await this.ormRepository.save(meal);

    return meal;
  }

  public async listByUserAndDate({
    userId,
    startDate,
    endDate,
  }: IMealListByUserAndDate): Promise<Meal[]> {
    const mealsFiltered = await this.ormRepository
      .createQueryBuilder('meals')
      .where('user_id = :userId', { userId: userId })
      .andWhere('date BETWEEN :startDate and :endDate', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
      .getMany();

    return mealsFiltered;
  }
}
