import CreateUserService from '../CreateUserService';
import BCryptHashProvider from '../../providers/BCryptHashProvider';
import FakeUsersRepository from '../../database/repositories/fakes/FakeUsersRepository';
import AppError from '../../errors/AppError';

it('should be able to create an user', async () => {
  const fakeUsersRepository = new FakeUsersRepository();
  const bCryptHashProvider = new BCryptHashProvider();

  const createUserService = new CreateUserService(
    fakeUsersRepository,
    bCryptHashProvider
  );

  const user = await createUserService.execute({
    firstName: 'Fulano',
    lastName: 'De Tal',
    email: 'fulano@email.com',
    password: 'fake-password',
  });

  const userCreated = await fakeUsersRepository.findOneByEmail(
    'fulano@email.com'
  );

  expect(userCreated).toEqual(user);
});

it('should not be able to create an user if the email is in use', async () => {
  const fakeUsersRepository = new FakeUsersRepository();
  const bCryptHashProvider = new BCryptHashProvider();

  const createUserService = new CreateUserService(
    fakeUsersRepository,
    bCryptHashProvider
  );

  await createUserService.execute({
    firstName: 'Fulano',
    lastName: 'De Tal',
    email: 'fulano@email.com',
    password: 'fake-password',
  });

  await expect(
    createUserService.execute({
      firstName: 'Beltrano',
      lastName: 'De Tal',
      email: 'fulano@email.com', // Same email
      password: 'fake-password',
    })
  ).rejects.toBeInstanceOf(AppError);
});
