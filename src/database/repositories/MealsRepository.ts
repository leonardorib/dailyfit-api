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

  public async create({ userId, name, date }: IMealCreation): Promise<Meal> {
    const meal = this.ormRepository.create({ user_id: userId, name, date });

    await this.ormRepository.save(meal);

    return meal;
  }

  public async save(meal: Meal): Promise<Meal> {
    const savedMeal = await this.ormRepository.save(meal);

    return savedMeal;
  }

  public async findById(mealId: string): Promise<Meal | undefined> {
    const meal = await this.ormRepository.findOne(mealId);

    return meal;
  }

  public async deleteById(mealId: string): Promise<Meal | undefined> {
    const meal = await this.ormRepository.findOne(mealId);

    await this.ormRepository.remove(meal);

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
	  .leftJoinAndSelect('meals.mealFoods', 'mealFoods')
	  .leftJoinAndSelect('mealFoods.food', 'foods')
	  .orderBy('meals.created_at', 'DESC')
      .getMany();

    return mealsFiltered;
  }
}
