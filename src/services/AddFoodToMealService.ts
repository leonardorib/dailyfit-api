import IFoodsRepository from '../database/repositories/base/IFoodsRepository';
import IMealsFoodsRepository from '../database/repositories/base/IMealsFoodsRepository';
import IMealsRepository from '../database/repositories/base/IMealsRepository';
import AppError from '../errors/AppError';

interface IRequest {
  mealId: string;
  foodId: string;
  quantity: number;
  quantity_unit: string;
}

export default class AddFoodToMealService {
  private mealFoodsRepository: IMealsFoodsRepository;
  private foodsRepository: IFoodsRepository;
  private mealsRepository: IMealsRepository;

  constructor(
    mealFoodsRepository: IMealsFoodsRepository,
    foodsRepository: IFoodsRepository,
    mealsRepository: IMealsRepository
  ) {
    this.mealFoodsRepository = mealFoodsRepository;
    this.foodsRepository = foodsRepository;
    this.mealsRepository = mealsRepository;
  }

  public async execute(addFoodItemData: IRequest) {
    const { mealId, foodId, quantity, quantity_unit } = addFoodItemData;

    const food = await this.foodsRepository.findById(foodId);

    if (!food) {
      throw new AppError('Food was not found', 404);
    }

    const meal = await this.mealsRepository.findById(mealId);

    if (!meal) {
      throw new AppError('Meal was not found', 404);
    }

    const existentMealFood = meal.mealFoods.find(
      (mealFood) => mealFood.food_id === foodId
    );

    const finalQuantity = existentMealFood
      ? quantity + existentMealFood.quantity
      : quantity;

    const proportionFactor = finalQuantity / food.standard_quantity;

    const name = food.name;
    const energy_kcal = proportionFactor * food.energy_kcal;
    const energy_kj = proportionFactor * food.energy_kj;
    const carbs = proportionFactor * food.carbs;
    const proteins = proportionFactor * food.proteins;
    const fats = proportionFactor * food.fats;

    const mealFoodData = {
      mealId,
      foodId,
      name,
      quantity: finalQuantity,
      quantity_unit,
      carbs,
      fats,
      proteins,
      energy_kcal,
      energy_kj,
    };

    if (existentMealFood) {
      const updatedMealItem = await this.mealFoodsRepository.save({
        ...existentMealFood,
        ...mealFoodData,
      });

      return updatedMealItem;
    }

	const newMealItem = await this.mealFoodsRepository.create(mealFoodData);

    return newMealItem;
  }
}
