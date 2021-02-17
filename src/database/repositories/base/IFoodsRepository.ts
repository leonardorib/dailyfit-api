import Food from '../../../models/Food';

export default interface IFoodsRepository {
  findById(foodId: string): Promise<Food | undefined>;

  listByName(name: string): Promise<Food[] | undefined>;
}
