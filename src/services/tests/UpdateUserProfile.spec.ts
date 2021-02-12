import UpdateUserProfileService from '../UpdateUserProfileService';
import FakeUsersRepository from '../../database/repositories/fakes/FakeUsersRepository';
import BCryptHashProvider from '../../providers/BCryptHashProvider';
import CreateUserService from '../CreateUserService';
import AppError from '../../errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let bCryptHashProvider: BCryptHashProvider;
let updateUserProfileService: UpdateUserProfileService;
let createUserService: CreateUserService;

describe('Update User Profile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    bCryptHashProvider = new BCryptHashProvider();
    updateUserProfileService = new UpdateUserProfileService(
      fakeUsersRepository,
      bCryptHashProvider
    );
    createUserService = new CreateUserService(
      fakeUsersRepository,
      bCryptHashProvider
    );
  });

  it('should be able to update user profile', async () => {
    const user = await createUserService.execute({
      firstName: 'Fulano',
      lastName: 'De Tal',
      email: 'fulano@email.com',
      password: 'fake-password',
    });

    await updateUserProfileService.execute({
      id: user.id,
      firstName: 'Beltrano',
      lastName: 'Ciclano',
      email: 'beltrano@email.com',
      password: 'fake-password',
    });

    const userUpdated = await fakeUsersRepository.findById(user.id);

    expect(userUpdated.first_name).toBe('Beltrano');
    expect(userUpdated.last_name).toBe('Ciclano');
    expect(userUpdated.email).toBe('beltrano@email.com');
  });

  it('should not be able to update user profile with wrong password provided', async () => {
    const user = await createUserService.execute({
      firstName: 'Fulano',
      lastName: 'De Tal',
      email: 'fulano@email.com',
      password: 'fake-password',
    });

    await expect(
      updateUserProfileService.execute({
        id: user.id,
        firstName: 'Beltrano',
        lastName: 'Ciclano',
        email: 'beltrano@email.com',
        password: 'fake-wrong-password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create user with email already in use', async () => {
    const user1 = await createUserService.execute({
      firstName: 'Fulano',
      lastName: 'De Tal',
      email: 'fulano@email.com',
      password: 'fake-password',
    });

    const user2 = await createUserService.execute({
      firstName: 'Beltrano',
      lastName: 'De Tal',
      email: 'beltrano@email.com',
      password: 'fake-password',
    });

    await expect(
      updateUserProfileService.execute({
        id: user1.id,
        firstName: 'Fulano',
        lastName: 'De Tal',
        email: 'beltrano@email.com',
        password: 'fake-password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password', async () => {
    const user = await createUserService.execute({
      firstName: 'Fulano',
      lastName: 'De Tal',
      email: 'fulano@email.com',
      password: 'fake-password',
    });

    const updatedUserData = {
      id: user.id,
      firstName: 'Beltrano',
      lastName: 'Ciclano',
      email: 'beltrano@email.com',
      password: 'fake-password',
      newPassword: 'new-fake-password',
      newPasswordConfirmation: 'new-fake-password',
    };

    await updateUserProfileService.execute(updatedUserData);

    const updatedUser = await fakeUsersRepository.findById(user.id);

    await expect(
      bCryptHashProvider.compareHash(
        updatedUserData.newPassword,
        updatedUser.password_hash
      )
    ).toBeTruthy();
  });

  it('should not be able to update password if new password confirmation does not match', async () => {
    const user = await createUserService.execute({
      firstName: 'Fulano',
      lastName: 'De Tal',
      email: 'fulano@email.com',
      password: 'fake-password',
    });

    const updatedUserData = {
      id: user.id,
      firstName: 'Beltrano',
      lastName: 'Ciclano',
      email: 'beltrano@email.com',
      password: 'fake-password',
      newPassword: 'new-fake-password',
      newPasswordConfirmation: 'new-fake-wrong-password',
    };

    await expect(
      updateUserProfileService.execute(updatedUserData)
    ).rejects.toBeInstanceOf(AppError);
  });
});
