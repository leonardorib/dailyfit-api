import Meal from '../../../models/Meal';

export interface IMealCreation {
  userId: string;
  name: string;
  date: Date;
}

export interface IMealListByUserAndDate {
  userId: string;
  startDate: Date;
  endDate: Date;
}

export default interface MealsRepository {
  create({ userId, name, date }: IMealCreation): Promise<Meal>;

  findById(mealId: string): Promise<Meal | undefined>;

  listByUserAndDate({
    userId,
    startDate,
    endDate,
  }: IMealListByUserAndDate): Promise<Meal[]> | undefined;

  // deleteById(mealId: string): Promise<Meal> | undefined;
}
