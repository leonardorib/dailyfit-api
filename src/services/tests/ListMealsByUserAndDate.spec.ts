import FakeMealsRepository from '../../database/repositories/fakes/FakeMealsRepository';
import ListMealsByUserAndDate from '../ListMealsByUserAndDate';

let listMealsByUserAndDate: ListMealsByUserAndDate;
let fakeMealsRepository: FakeMealsRepository;

describe('List meals by user and date', () => {
  beforeEach(() => {
    fakeMealsRepository = new FakeMealsRepository();
    listMealsByUserAndDate = new ListMealsByUserAndDate(fakeMealsRepository);
  });

  it('should be able to list meals filtered by user and date', async () => {
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
      date: new Date(2021, 0, 24),
      name: 'fake-meal-3',
    };

    const mealToBeCreated4 = {
      userId: 'fake-user-id-3',
      date: new Date(2021, 0, 22),
      name: 'fake-meal-4',
    };

    const mealToBeCreated5 = {
      userId: 'fake-user-id-3',
      date: new Date(2021, 0, 20),
      name: 'fake-meal-5',
    };

    await fakeMealsRepository.create(mealToBeCreated1);
    await fakeMealsRepository.create(mealToBeCreated2);
    await fakeMealsRepository.create(mealToBeCreated3);
    await fakeMealsRepository.create(mealToBeCreated4);
    await fakeMealsRepository.create(mealToBeCreated5);

    const meals1 = await listMealsByUserAndDate.execute({
      userId: 'fake-user-id-1',
      startDate: new Date(2021, 0, 20),
      endDate: new Date(2021, 0, 24),
    });

    const meals2 = await listMealsByUserAndDate.execute({
      userId: 'fake-user-id-3',
      startDate: new Date(2021, 0, 20),
      endDate: new Date(2021, 0, 24),
    });

    const meals3 = await listMealsByUserAndDate.execute({
      userId: 'fake-user-id-3',
      startDate: new Date(2021, 0, 22),
      endDate: new Date(2021, 0, 24),
    });

    expect(meals1).toHaveLength(1);
    expect(meals2).toHaveLength(3);
    expect(meals3).toHaveLength(2);
  });
});
