import MealFood from '../../../models/MealFoods';

export interface IMealFoodItemCreation {
  mealId: string;
  foodId: string;
  name: string;
  quantity: number;
  quantity_unit: string;
  energy_kcal: number;
  energy_kj: number;
  carbs: number;
  proteins: number;
  fats: number;
}

export default interface IMealsFoodsRepository {
  create({
    mealId,
    foodId,
    name,
    quantity,
    quantity_unit,
    energy_kcal,
    energy_kj,
    carbs,
    proteins,
    fats,
  }: IMealFoodItemCreation): Promise<MealFood>;

  findById(mealFoodId: string): Promise<MealFood | undefined>;

  deleteById(mealFoodId: string): Promise<MealFood | undefined>;

  listByMealId(mealId: string): Promise<MealFood[] | undefined>;
}
