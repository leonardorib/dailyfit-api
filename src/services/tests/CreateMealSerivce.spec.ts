import FakeMealsRepository from '../../database/repositories/fakes/FakeMealsRepository';
import CreateMealService from '../CreateMealService';

let fakeMealsRepository: FakeMealsRepository;
let createMeal: CreateMealService;

describe('Create meal', () => {
  beforeEach(() => {
    fakeMealsRepository = new FakeMealsRepository();
    createMeal = new CreateMealService(fakeMealsRepository);
  });

  it('should be able to create a meal', async () => {
    const meal = {
      userId: 'fake-user-id',
      name: 'Refeição Fake',
      date: new Date(Date.now()),
    };

    const mealCreated = await createMeal.execute(meal);

    expect(mealCreated.user_id).toEqual('fake-user-id');
    expect(mealCreated.name).toEqual('Refeição Fake');
  });
});
