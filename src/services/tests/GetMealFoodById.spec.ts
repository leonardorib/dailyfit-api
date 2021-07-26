import FakeMealsRepository from '../../database/repositories/fakes/FakeMealsRepository';
import FakeMealFoodsRepository from '../../database/repositories/fakes/FakeMealsFoodsRepository';
import GetMealFoodByIdService from '../GetMealFoodByIdService';
import { IMealCreation } from '../../database/repositories/base/IMealsRepository';
import Meal from '../../models/Meal';
import MealFood from '../../models/MealFoods';
import AppError from '../../errors/AppError';

interface IMealFoodData {
  carbs: number;
  proteins: number;
  fats: number;
  energy_kcal: number;
  energy_kj: number;
  foodId: string;
  mealId: string;
  name: string;
  quantity: number;
  quantity_unit: string;
}

describe('Get meal by id', () => {
  let getMealFoodById: GetMealFoodByIdService;
  let fakeMealsRepository: FakeMealsRepository;
  let fakeMealFoodsRepository: FakeMealFoodsRepository;
  let mealData: IMealCreation;
  let mealFoodData: IMealFoodData;
  let meal: Meal;
  let mealFood: MealFood;

  beforeAll(async () => {
    fakeMealsRepository = new FakeMealsRepository();
    fakeMealFoodsRepository = new FakeMealFoodsRepository();
    getMealFoodById = new GetMealFoodByIdService(fakeMealFoodsRepository);

    mealData = {
      userId: 'fake-user-id-1',
      date: new Date(2021, 0, 20),
      name: 'fake-meal-1',
    };

    meal = await fakeMealsRepository.create(mealData);

    mealFoodData = {
      carbs: 20,
      proteins: 20,
      fats: 20,
      energy_kcal: 100,
      energy_kj: 100,
      foodId: 'fake-food-id',
      mealId: meal.id,
      name: 'meal food name',
      quantity: 100,
      quantity_unit: 'g',
    };

    mealFood = await fakeMealFoodsRepository.create(mealFoodData);
  });

  it('should be able to get meal food by id', async () => {
    const mealFoodFound = await getMealFoodById.execute({
      mealFoodId: mealFood.id,
    });

    expect(mealFoodFound).toBeDefined();
    expect(mealFoodFound.id).toBe(mealFood.id);
  });

  it('should return error if meal food does not exist', async () => {
    await expect(
      getMealFoodById.execute({
        mealFoodId: "non-existent-meal-food-id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
