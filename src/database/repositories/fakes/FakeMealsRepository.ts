import Meal from '../../../models/Meal';
import IMealsRepository, {
  IMealCreation,
  IMealListByUserAndDate,
} from '../base/IMealsRepository';
import { v4 as uuid } from 'uuid';

export default class FakeMealsRepository implements IMealsRepository {
  private meals: Meal[];

  constructor() {
    this.meals = [];
  }

  public async create({ userId, name, date }: IMealCreation): Promise<Meal> {
    const meal = new Meal();

    Object.assign(meal, { id: uuid(), user_id: userId, name, date });

    this.meals.push(meal);

    return meal;
  }

  public async findById(mealId: string): Promise<Meal | undefined> {
    const meal = this.meals.find((meal) => meal.id === mealId);

    return meal;
  }

  public async listByUserAndDate({
    userId,
    startDate,
    endDate,
  }: IMealListByUserAndDate) {
    const mealsFiltered = this.meals.filter(
      (meal) =>
        meal.user_id === userId &&
        meal.date >= startDate &&
        meal.date <= endDate
    );

    return mealsFiltered;
  }
}
