import FakeUsersRepository from '../../database/repositories/fakes/FakeUsersRepository';
import BCryptHashProvider from '../../providers/BCryptHashProvider';
import DeleteUserService from '../DeleteUserService';
import CreateUserService from '../CreateUserService';
import AppError from '../../errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let bCryptHashProvider: BCryptHashProvider;
let deleteUserService: DeleteUserService;
let createUserService: CreateUserService;

describe('Delete user', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    bCryptHashProvider = new BCryptHashProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      bCryptHashProvider
    );
    deleteUserService = new DeleteUserService(
      fakeUsersRepository,
      bCryptHashProvider
    );
  });

  it('should be able to delete an user', async () => {
    const user = await createUserService.execute({
      firstName: 'Fulano',
      lastName: 'De Tal',
      email: 'fulano@email.com',
      password: 'password',
    });

    const deletedUser = await deleteUserService.execute({
      userId: user.id,
      password: 'password',
    });

    const userFound = await fakeUsersRepository.findById(user.id);

    expect(deletedUser.id).toEqual(user.id);
    expect(deletedUser.first_name).toEqual(user.first_name);
    expect(deletedUser.last_name).toEqual(user.last_name);
    expect(deletedUser.email).toEqual(user.email);

    expect(userFound).toBeFalsy();
  });

  it('should not be able to delete an user if a wrong password is provided', async () => {
    const user = await createUserService.execute({
      firstName: 'Fulano',
      lastName: 'De Tal',
      email: 'fulano@email.com',
      password: 'password',
    });

    await expect(
      deleteUserService.execute({ userId: user.id, password: 'wrong-password' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should return an error if trying to delete inexisting user', async () => {
    await expect(
      deleteUserService.execute({ userId: 'user-id', password: 'password' })
    ).rejects.toBeInstanceOf(AppError);
  });
});
