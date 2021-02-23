import FakeMealsRepository from '../../database/repositories/fakes/FakeMealsRepository';
import AppError from '../../errors/AppError';
import UpdateMealNameService from '../UpdateMealNameService';

let fakeMealsRepository: FakeMealsRepository;
let updateMealName: UpdateMealNameService;

describe('Update meal name', () => {
  beforeEach(() => {
    fakeMealsRepository = new FakeMealsRepository();
    updateMealName = new UpdateMealNameService(fakeMealsRepository);
  });

  it('should be able to update a meal name', async () => {
    const meal = await fakeMealsRepository.create({
      userId: 'fake-user-id',
      date: new Date(2021, 0, 20),
      name: 'fake-meal',
    });

    const updatedMeal = await updateMealName.execute({
      mealId: meal.id,
      userId: meal.user_id,
      name: 'new-name',
    });

    expect(updatedMeal.name).toBe('new-name');
  });

  it('should return error if trying to update an inexistent meal', async () => {
    await expect(
      updateMealName.execute({
        mealId: 'inexistent-meal-id',
        userId: 'fake-user-id',
        name: 'new-name',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not allow unauthorized user to update meal name', async () => {
    const meal = await fakeMealsRepository.create({
      userId: 'fake-user-id',
      date: new Date(2021, 0, 20),
      name: 'fake-meal',
    });

    await expect(
      updateMealName.execute({
        mealId: meal.id,
        userId: 'another-user-id',
        name: 'new-name',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
