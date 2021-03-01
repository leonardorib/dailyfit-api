import FakeMealsRepository from '../../database/repositories/fakes/FakeMealsRepository';
import FakeMealsFoodsRepository from '../../database/repositories/fakes/FakeMealsFoodsRepository';
import ListMealsByUserAndDate from '../ListMealsByUserAndDate';

let listMealsByUserAndDate: ListMealsByUserAndDate;
let fakeMealsRepository: FakeMealsRepository;
let fakeMealsFoodsRepository: FakeMealsFoodsRepository;

describe('List meals by user and date', () => {
  beforeEach(() => {
    fakeMealsRepository = new FakeMealsRepository();
    fakeMealsFoodsRepository = new FakeMealsFoodsRepository();
    listMealsByUserAndDate = new ListMealsByUserAndDate(
      fakeMealsRepository,
      fakeMealsFoodsRepository
    );
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

    const meal1 = await fakeMealsRepository.create(mealToBeCreated1);
    await fakeMealsFoodsRepository.create({
      mealId: meal1.id,
      foodId: 'dbd4888b-08b2-4656-8b27-4cb6c289252e',
      name: 'Abacate',
      quantity_unit: 'g',
      quantity: 100,
      carbs: 6,
      proteins: 1.2,
      fats: 8.4,
      energy_kcal: 96,
      energy_kj: 402,
    });

    await fakeMealsRepository.create(mealToBeCreated2);
    await fakeMealsRepository.create(mealToBeCreated3);
    await fakeMealsRepository.create(mealToBeCreated4);
    await fakeMealsRepository.create(mealToBeCreated5);

    const response1 = await listMealsByUserAndDate.execute({
      userId: 'fake-user-id-1',
      startDate: new Date(2021, 0, 20),
      endDate: new Date(2021, 0, 24),
    });

    const response2 = await listMealsByUserAndDate.execute({
      userId: 'fake-user-id-3',
      startDate: new Date(2021, 0, 20),
      endDate: new Date(2021, 0, 24),
    });

    const response3 = await listMealsByUserAndDate.execute({
      userId: 'fake-user-id-3',
      startDate: new Date(2021, 0, 22),
      endDate: new Date(2021, 0, 24),
    });

    expect(response1.meals).toHaveLength(1);
    expect(response2.meals).toHaveLength(3);
    expect(response3.meals).toHaveLength(2);
  });
});
