import FakeMealFoodsRepository from '../../database/repositories/fakes/FakeMealsFoodsRepository';
import AppError from '../../errors/AppError';
import DeleteMealFoodService from '../DeleteMealFoodService';

let fakeMealFoodsRepository: FakeMealFoodsRepository;
let deleteMealFood: DeleteMealFoodService;

describe('Delete meal food service', () => {
  beforeEach(() => {
    fakeMealFoodsRepository = new FakeMealFoodsRepository();
    deleteMealFood = new DeleteMealFoodService(fakeMealFoodsRepository);
  });

  it('should be able to delete a meal food item service', async () => {
    const mealFood = await fakeMealFoodsRepository.create({
      mealId: 'fake-meal-id',
      foodId: 'fake-food-id',
      name: 'fake-food-name',
      quantity: 50,
      quantity_unit: 'g',
      energy_kcal: 1000,
      energy_kj: 4000,
      carbs: 20,
      proteins: 10,
      fats: 5,
    });

    const deletedMeal = await deleteMealFood.execute(mealFood.id);

    const foundDeletedMeal = await fakeMealFoodsRepository.findById(
      mealFood.id
    );

    expect(deletedMeal.id).toBe(mealFood.id);
    expect(foundDeletedMeal).toBeFalsy();
  });

  it('should throw error if trying to delete an inexistent meal food item', async () => {
    await expect(
      deleteMealFood.execute('inexistent-id')
    ).rejects.toBeInstanceOf(AppError);
  });
});
