import Food from '../../../models/Food';

export default interface IFoodsRepository {
  listByName(name: string): Promise<Food[] | undefined>;
}
