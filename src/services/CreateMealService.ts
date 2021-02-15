import IMealsRepository from '../database/repositories/base/IMealsRepository';

interface IRequest {
  userId: string;
  name: string;
  date: Date;
}

export default class CreateMealService {
  private mealsRepository: IMealsRepository;

  constructor(mealsRepository: IMealsRepository) {
    this.mealsRepository = mealsRepository;
  }

  public async execute({ userId, name, date }: IRequest) {
    const meal = await this.mealsRepository.create({ userId, name, date });

    return meal;
  }
}
