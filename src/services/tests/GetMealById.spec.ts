import FakeMealsRepository from '../../database/repositories/fakes/FakeMealsRepository';
import GetMealByIdService from '../GetMealByIdService';
import { IMealCreation } from '../../database/repositories/base/IMealsRepository';
import Meal from '../../models/Meal';
import AppError from '../../errors/AppError';

let getMealById: GetMealByIdService;
let fakeMealsRepository: FakeMealsRepository;
let mealData: IMealCreation;
let meal: Meal;

describe('Get meal by id', () => {
  beforeAll(async () => {
    fakeMealsRepository = new FakeMealsRepository();
    getMealById = new GetMealByIdService(
      fakeMealsRepository,
    );

    mealData = {
      userId: 'fake-user-id-1',
      date: new Date(2021, 0, 20),
      name: 'fake-meal-1',
    };

    meal = await fakeMealsRepository.create(mealData);

    console.log('Created meal: ', meal);
  });

  it('should be able to get meal by id', async () => {
    const mealFound = await getMealById.execute({
      mealId: meal.id,
      userId: meal.user_id,
    });

    expect(mealFound).toBeDefined();
    expect(mealFound.id).toBe(meal.id);
    expect(mealFound.user_id).toBe(mealData.userId);
  });

  it('should return error if meal does not exist', async () => {
    await expect(
      getMealById.execute({
        mealId: 'some-id-that-does-not-exist',
        userId: meal.user_id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should return error user is not allowed', async () => {
    await expect(
      getMealById.execute({
        mealId: meal.id,
        userId: 'some-unauthorized-user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
