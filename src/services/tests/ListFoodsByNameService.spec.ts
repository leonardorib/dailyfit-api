import FakeFoodsRepository from '../../database/repositories/fakes/FakeFoodsRepository';
import ListFoodsByNameService from '../ListFoodsByNameService';

let fakeFoodsRepository: FakeFoodsRepository;
let listFoodsByName: ListFoodsByNameService;

describe('List foods by name', () => {
  beforeEach(() => {
    fakeFoodsRepository = new FakeFoodsRepository();
    listFoodsByName = new ListFoodsByNameService(fakeFoodsRepository);
  });

  it('should be able to list foods by name', async () => {
    const foundBanana = await listFoodsByName.execute('banana');
    const foundMaca = await listFoodsByName.execute('maçã');
    const foundNothing = await listFoodsByName.execute('fake-food');

    expect(foundBanana.length).toBe(1);
    expect(foundMaca.length).toBe(1);
    expect(foundNothing.length).toBe(0);
  });
});
