import CreateUserService from '../CreateUserService';
import AuthenticateService from '../AuthenticateService';
import BCryptHashProvider from '../../providers/BCryptHashProvider';
import FakeUsersRepository from '../../database/repositories/fakes/FakeUsersRepository';

it('should be able to authenticate an user', async () => {
  const bCryptHashProvider = new BCryptHashProvider();
  const fakeUsersRepository = new FakeUsersRepository();

  const createUserService = new CreateUserService(
    fakeUsersRepository,
    bCryptHashProvider
  );

  const authenticateService = new AuthenticateService(
    fakeUsersRepository,
    bCryptHashProvider
  );

  await createUserService.execute({
    firstName: 'Fulano',
    lastName: 'De Tal',
    email: 'email@email.com',
    password: 'password',
  });

  const response = await authenticateService.execute({
    email: 'email@email.com',
    password: 'password',
  });

  expect(response).toHaveProperty('token');
});

it('should not be able to authenticate an user that does not exist', async () => {
  const bCryptHashProvider = new BCryptHashProvider();
  const fakeUsersRepository = new FakeUsersRepository();

  const createUserService = new CreateUserService(
    fakeUsersRepository,
    bCryptHashProvider
  );

  const authenticateService = new AuthenticateService(
    fakeUsersRepository,
    bCryptHashProvider
  );

  await createUserService.execute({
    firstName: 'Fulano',
    lastName: 'De Tal',
    email: 'email@email.com',
    password: 'password',
  });

  await expect(
    authenticateService.execute({
      email: 'wrong.email@email.com',
      password: 'password',
    })
  ).rejects.toThrowError();
});

it('should not be able to authenticate with wrong password', async () => {
  const bCryptHashProvider = new BCryptHashProvider();
  const fakeUsersRepository = new FakeUsersRepository();

  const createUserService = new CreateUserService(
    fakeUsersRepository,
    bCryptHashProvider
  );

  const authenticateService = new AuthenticateService(
    fakeUsersRepository,
    bCryptHashProvider
  );

  await createUserService.execute({
    firstName: 'Fulano',
    lastName: 'De Tal',
    email: 'email@email.com',
    password: 'password',
  });

  await expect(
    authenticateService.execute({
      email: 'email@email.com',
      password: 'wrong-password',
    })
  ).rejects.toThrowError();
});
