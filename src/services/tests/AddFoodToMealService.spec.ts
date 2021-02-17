import FakeMealFoodsRepository from '../../database/repositories/fakes/FakeMealsFoodsRepository';
import FakeFoodsRepository from '../../database/repositories/fakes/FakeFoodsRepository';
import FakeMealsRepository from '../../database/repositories/fakes/FakeMealsRepository';

import AddFoodToMealService from '../AddFoodToMealService';
import AppError from '../../errors/AppError';

let fakeMealFoodsRepository: FakeMealFoodsRepository;
let fakeFoodsRepository: FakeFoodsRepository;
let fakeMealsRepository: FakeMealsRepository;
let addFoodToMeal: AddFoodToMealService;

describe('Add food to meal', () => {
  beforeEach(() => {
    fakeMealFoodsRepository = new FakeMealFoodsRepository();
    fakeFoodsRepository = new FakeFoodsRepository();
    fakeMealsRepository = new FakeMealsRepository();

    addFoodToMeal = new AddFoodToMealService(
      fakeMealFoodsRepository,
      fakeFoodsRepository,
      fakeMealsRepository
    );
  });

  it('should be able to add a food item to a meal', async () => {
    const meal = await fakeMealsRepository.create({
      userId: 'fake-user-id',
      date: new Date(2021, 0, 1),
      name: 'fake-meal-name',
    });

    const mealFood = await addFoodToMeal.execute({
      mealId: meal.id,
      foodId: '43eb42e6-f00f-4076-9eb8-f91f81018c6e',
      quantity: 50,
      quantity_unit: 'g',
    });

    expect(mealFood.meal_id).toBe(meal.id);
    expect(mealFood.food_id).toBe('43eb42e6-f00f-4076-9eb8-f91f81018c6e');
    expect(mealFood.quantity).toBe(50);
  });

  it('should not be able to add a food that does not exist', async () => {
    const meal = await fakeMealsRepository.create({
      userId: 'fake-user-id',
      date: new Date(2021, 0, 1),
      name: 'fake-meal-name',
    });

    await expect(
      addFoodToMeal.execute({
        mealId: meal.id,
        foodId: 'inexistent-food',
        quantity: 50,
        quantity_unit: 'g',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to add a food item to a meal that does not exist', async () => {
    await expect(
      addFoodToMeal.execute({
        mealId: 'inexistent-meal',
        foodId: '43eb42e6-f00f-4076-9eb8-f91f81018c6e',
        quantity: 50,
        quantity_unit: 'g',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
