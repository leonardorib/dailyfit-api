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

    Object.assign(meal, { id: uuid(), user_id: userId, name, date, mealFoods: [] });

    this.meals.push(meal);

    return meal;
  }

  public async save(meal: Meal): Promise<Meal> {
    const mealIndex = this.meals.findIndex(
      (mealInMeals) => mealInMeals.id === meal.id
    );

    this.meals[mealIndex] = meal;

    return this.meals[mealIndex];
  }

  public async findById(mealId: string): Promise<Meal | undefined> {
    const meal = this.meals.find((meal) => meal.id === mealId);

    return meal;
  }

  public async deleteById(mealId: string): Promise<Meal | undefined> {
    const mealFound = this.meals.find((meal) => meal.id === mealId);

    this.meals = this.meals.filter((meal) => meal.id !== mealId);

    return mealFound;
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
