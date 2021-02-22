import DeleteMealByIdService from '../DeleteMealByIdService';
import FakeMealsRepository from '../../database/repositories/fakes/FakeMealsRepository';
import AppError from '../../errors/AppError';

let fakeMealsRepository: FakeMealsRepository;
let deleteMealById: DeleteMealByIdService;

describe('Delete meal by id', () => {
  beforeEach(() => {
    fakeMealsRepository = new FakeMealsRepository();
    deleteMealById = new DeleteMealByIdService(fakeMealsRepository);
  });

  it('should be able do delete a meal', async () => {
    const mealToBeCreated1 = {
      userId: 'fake-user-id-one',
      date: new Date(2021, 0, 20),
      name: 'fake-meal-one',
    };

    const mealToBeCreated2 = {
      userId: 'fake-user-id-two',
      date: new Date(2021, 0, 22),
      name: 'fake-meal-two',
    };

    const meal1 = await fakeMealsRepository.create(mealToBeCreated1);
    const meal2 = await fakeMealsRepository.create(mealToBeCreated2);

    await deleteMealById.execute({ mealId: meal1.id, userId: meal1.user_id });

    const meal1Found = await fakeMealsRepository.findById(meal1.id);

    expect(meal1Found).toBeFalsy();

    const meal2Found = await fakeMealsRepository.findById(meal2.id);

    expect(meal2Found).toBeTruthy();
  });

  it('should not be able to delete a meal of another user', async () => {
    const mealToBeCreated1 = {
      userId: 'fake-user-id-one',
      date: new Date(2021, 0, 20),
      name: 'fake-meal-one',
    };

    const mealToBeCreated2 = {
      userId: 'fake-user-id-two',
      date: new Date(2021, 0, 22),
      name: 'fake-meal-two',
    };

    const meal1 = await fakeMealsRepository.create(mealToBeCreated1);
    const meal2 = await fakeMealsRepository.create(mealToBeCreated2);

    await expect(
      deleteMealById.execute({ mealId: meal1.id, userId: meal2.user_id })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should return error if trying to delete a meal that does not exist', async () => {
    const mealToBeCreated1 = {
      userId: 'fake-user-id-one',
      date: new Date(2021, 0, 20),
      name: 'fake-meal-one',
    };

    const meal1 = await fakeMealsRepository.create(mealToBeCreated1);

    await expect(
      deleteMealById.execute({
        mealId: 'wrong-meal-id',
        userId: 'fake-user-id-one',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
