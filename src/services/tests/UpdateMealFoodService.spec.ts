import UpdateMealFoodService from '../UpdateMealFoodService';
import FakeMealsFoodsRepository from '../../database/repositories/fakes/FakeMealsFoodsRepository';
import FakeMealsRepository from '../../database/repositories/fakes/FakeMealsRepository';
import FakeFoodsRepository from '../../database/repositories/fakes/FakeFoodsRepository';
import AppError from '../../errors/AppError';

let fakeMealsFoodsRepository: FakeMealsFoodsRepository;
let fakeMealsRepository: FakeMealsRepository;
let fakeFoodsRepository: FakeFoodsRepository;

let updateMealFood: UpdateMealFoodService;

describe('Updated MealFood', () => {
  beforeEach(() => {
    fakeMealsFoodsRepository = new FakeMealsFoodsRepository();
    fakeMealsRepository = new FakeMealsRepository();
    fakeFoodsRepository = new FakeFoodsRepository();

    updateMealFood = new UpdateMealFoodService(
      fakeMealsFoodsRepository,
      fakeMealsRepository,
      fakeFoodsRepository
    );
  });

  it('should be able to updated a meal food item', async () => {
    const meal = await fakeMealsRepository.create({
      userId: 'fake-user-id',
      name: 'fake-meal',
      date: new Date(Date.now()),
    });

    const mealFood = await fakeMealsFoodsRepository.create({
      mealId: meal.id,
      foodId: 'dbd4888b-08b2-4656-8b27-4cb6c289252e', // Abacate
      name: 'Abacate',
      quantity: 50,
      quantity_unit: 'g',
      energy_kcal: 1000,
      energy_kj: 4000,
      carbs: 20,
      proteins: 10,
      fats: 5,
    });

    const updatedMealFood = await updateMealFood.execute({
      mealFoodId: mealFood.id,
      userId: meal.user_id,
      foodId: '43eb42e6-f00f-4076-9eb8-f91f81018c6e', // Banana
      quantity: 200,
    });

    expect(updatedMealFood.name).toBe('Banana');
    expect(updatedMealFood.food_id).toBe(
      '43eb42e6-f00f-4076-9eb8-f91f81018c6e'
    );
    expect(updatedMealFood.quantity).toBe(200);
  });

  it('should return error if meal food does not exist', async () => {
    const meal = await fakeMealsRepository.create({
      userId: 'fake-user-id',
      name: 'fake-meal',
      date: new Date(Date.now()),
    });

    await expect(
      updateMealFood.execute({
        mealFoodId: 'inexistent-meal-food',
        userId: meal.user_id,
        foodId: '43eb42e6-f00f-4076-9eb8-f91f81018c6e', // Banana
        quantity: 200,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should return error if other user tries to update the mealfood item', async () => {
    const meal = await fakeMealsRepository.create({
      userId: 'fake-user-id',
      name: 'fake-meal',
      date: new Date(Date.now()),
    });

    const mealFood = await fakeMealsFoodsRepository.create({
      mealId: meal.id,
      foodId: 'dbd4888b-08b2-4656-8b27-4cb6c289252e', // Abacate
      name: 'Abacate',
      quantity: 50,
      quantity_unit: 'g',
      energy_kcal: 1000,
      energy_kj: 4000,
      carbs: 20,
      proteins: 10,
      fats: 5,
    });

    await expect(
      updateMealFood.execute({
        mealFoodId: mealFood.id,
        userId: 'unauthorized-user-id',
        foodId: '43eb42e6-f00f-4076-9eb8-f91f81018c6e', // Banana
        quantity: 200,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should maintain the same food if a new foodId is not provided', async () => {
    const meal = await fakeMealsRepository.create({
      userId: 'fake-user-id',
      name: 'fake-meal',
      date: new Date(Date.now()),
    });

    const mealFood = await fakeMealsFoodsRepository.create({
      mealId: meal.id,
      foodId: 'dbd4888b-08b2-4656-8b27-4cb6c289252e', // Abacate
      name: 'Abacate',
      quantity: 50,
      quantity_unit: 'g',
      energy_kcal: 1000,
      energy_kj: 4000,
      carbs: 20,
      proteins: 10,
      fats: 5,
    });

    const updatedMealFood = await updateMealFood.execute({
      mealFoodId: mealFood.id,
      userId: meal.user_id,
      quantity: 200,
    });

    expect(updatedMealFood.name).toBe('Abacate');
    expect(updatedMealFood.food_id).toBe(
      'dbd4888b-08b2-4656-8b27-4cb6c289252e'
    );
    expect(updatedMealFood.quantity).toBe(200);
  });

  it('should maintain the same quantity if new quantity is not provided', async () => {
    const meal = await fakeMealsRepository.create({
      userId: 'fake-user-id',
      name: 'fake-meal',
      date: new Date(Date.now()),
    });

    const mealFood = await fakeMealsFoodsRepository.create({
      mealId: meal.id,
      foodId: 'dbd4888b-08b2-4656-8b27-4cb6c289252e', // Abacate
      name: 'Abacate',
      quantity: 50,
      quantity_unit: 'g',
      energy_kcal: 1000,
      energy_kj: 4000,
      carbs: 20,
      proteins: 10,
      fats: 5,
    });

    const updatedMealFood = await updateMealFood.execute({
      mealFoodId: mealFood.id,
      userId: meal.user_id,
      foodId: '43eb42e6-f00f-4076-9eb8-f91f81018c6e', // Banana
    });

    expect(updatedMealFood.name).toBe('Banana');
    expect(updatedMealFood.food_id).toBe(
      '43eb42e6-f00f-4076-9eb8-f91f81018c6e'
    );
    expect(updatedMealFood.quantity).toBe(50);
  });
});
