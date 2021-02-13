import Food from '../../../models/Food';
import IFoodsRepository from '../base/IFoodsRepository';

export default class FakeFoodsRepository implements IFoodsRepository {
  private foods: Food[];

  constructor() {
    this.foods = [
      {
        id: 'dbd4888b-08b2-4656-8b27-4cb6c289252e',
        name: 'Abacate',
        standard_quantity: 100,
        standard_quantity_unit: 'g',
        energy_kcal: 96,
        energy_kj: 402,
        carbs: 6,
        proteins: 1.2,
        fats: 8.4,
        created_at: new Date('2021-02-04T17:52:25.789Z'),
        updated_at: new Date('2021-02-04T17:52:25.789Z'),
      },
      {
        id: '43eb42e6-f00f-4076-9eb8-f91f81018c6e',
        name: 'Banana',
        standard_quantity: 100,
        standard_quantity_unit: 'g',
        energy_kcal: 98,
        energy_kj: 411,
        carbs: 26,
        proteins: 1.3,
        fats: 0.1,
        created_at: new Date('2021-02-04T17:52:25.789Z'),
        updated_at: new Date('2021-02-04T17:52:25.789Z'),
      },
      {
        id: '0740f303-36be-4f34-85ff-b0f39942ddee',
        name: 'Maçã',
        standard_quantity: 100,
        standard_quantity_unit: 'g',
        energy_kcal: 63,
        energy_kj: 262,
        carbs: 16.6,
        proteins: 0.2,
        fats: 0.2,
        created_at: new Date('2021-02-04T17:52:25.789Z'),
        updated_at: new Date('2021-02-04T17:52:25.789Z'),
      },
    ];
  }

  public async listByName(foodName: string): Promise<Food[] | undefined> {
    const foundFoods = this.foods.filter((food) =>
      food.name.toLowerCase().includes(foodName.toLowerCase())
    );

    return foundFoods;
  }
}
