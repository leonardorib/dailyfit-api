import IMealsRepository, {
  IMealListByUserAndDate,
} from '../database/repositories/base/IMealsRepository';

export default class ListMealsByUserAndDate {
  private mealsRepository: IMealsRepository;

  constructor(mealsRepository: IMealsRepository) {
    this.mealsRepository = mealsRepository;
  }

  public async execute({ userId, startDate, endDate }: IMealListByUserAndDate) {
    const meals = await this.mealsRepository.listByUserAndDate({
      userId,
      startDate,
      endDate,
    });

    return meals;
  }
}
