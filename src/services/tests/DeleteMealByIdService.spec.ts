import DeleteMealByIdService from '../DeleteMealByIdService';
import FakeMealsRepository from '../../database/repositories/fakes/FakeMealsRepository';
import FakeMealsFoodsRepository from '../../database/repositories/fakes/FakeMealsFoodsRepository';
import AppError from '../../errors/AppError';

let fakeMealsRepository: FakeMealsRepository;
let fakeMealsFoodsRepository: FakeMealsFoodsRepository;
let deleteMealById: DeleteMealByIdService;

describe('Delete meal by id', () => {
  beforeEach(() => {
    fakeMealsRepository = new FakeMealsRepository();
    fakeMealsFoodsRepository = new FakeMealsFoodsRepository();
    deleteMealById = new DeleteMealByIdService(
      fakeMealsRepository,
      fakeMealsFoodsRepository
    );
  });

  it('should be able do delete a meal', async () => {
    const mealToBeCreated1 = {
      userId: 'fake-user-id-1',
      date: new Date(2021, 0, 20),
      name: 'fake-meal-1',
    };

    const mealToBeCreated2 = {
      userId: 'fake-user-id-2',
      date: new Date(2021, 0, 22),
      name: 'fake-meal-2',
    };

    const mealToBeCreated3 = {
      userId: 'fake-user-id-3',
      date: new Date(2021, 0, 22),
      name: 'fake-meal-3',
    };

    const mealFoodData = {
      foodId: 'dbd4888b-08b2-4656-8b27-4cb6c289252e',
      name: 'Abacate',
      quantity: 100,
      quantity_unit: 'g',
      energy_kcal: 96,
      energy_kj: 402,
      carbs: 6,
      proteins: 1.2,
      fats: 8.4,
    };

    const meal1 = await fakeMealsRepository.create(mealToBeCreated1);
    await fakeMealsFoodsRepository.create({
      mealId: meal1.id,
      ...mealFoodData,
    });

    const meal2 = await fakeMealsRepository.create(mealToBeCreated2);

    const meal3 = await fakeMealsRepository.create(mealToBeCreated3);

    await deleteMealById.execute({
      mealId: meal1.id,
      userId: meal1.user_id,
    });

    await deleteMealById.execute({
      mealId: meal2.id,
      userId: meal2.user_id,
    });

    const meal1Found = await fakeMealsRepository.findById(meal1.id);

    expect(meal1Found).toBeFalsy();

    const meal2Found = await fakeMealsRepository.findById(meal2.id);

    expect(meal2Found).toBeFalsy();

    const meal3Found = await fakeMealsRepository.findById(meal3.id);

    expect(meal3Found).toBeTruthy();
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
