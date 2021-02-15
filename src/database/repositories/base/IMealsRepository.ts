import Meal from '../../../models/Meal';

export interface IMealCreation {
  userId: string;
  name: string;
  date: Date;
}

export interface IMealListByUserAndDate {
  userId: string;
  date: Date;
}

export default interface MealsRepository {
  create({ userId, name, date }: IMealCreation): Promise<Meal>;

  // listByUserAndDate({
  //   userId,
  //   date,
  // }: IMealListByUserAndDate): Promise<Meal[]> | undefined;

  // deleteById(mealId: string): Promise<Meal> | undefined;
}
