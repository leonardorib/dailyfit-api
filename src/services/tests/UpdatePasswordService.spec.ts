import UpdatePasswordService from '../UpdatePasswordService';
import FakeUsersRepository from '../../database/repositories/fakes/FakeUsersRepository';
import BCryptHashProvider from '../../providers/BCryptHashProvider';
import CreateUserService from '../CreateUserService';
import AppError from '../../errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let bCryptHashProvider: BCryptHashProvider;
let updatePasswordService: UpdatePasswordService;
let createUserService: CreateUserService;

describe('Update User Profile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    bCryptHashProvider = new BCryptHashProvider();
    updatePasswordService = new UpdatePasswordService(
      fakeUsersRepository,
      bCryptHashProvider
    );
    createUserService = new CreateUserService(
      fakeUsersRepository,
      bCryptHashProvider
    );
  });

  it('should be able to update password', async () => {
    const user = await createUserService.execute({
      firstName: 'Fulano',
      lastName: 'De Tal',
      email: 'fulano@email.com',
      password: 'fake-password',
    });

	const newPassword = 'new-fake-password';

    await updatePasswordService.execute({
		id: user.id,
		password: 'fake-password',
		newPassword: newPassword,
		newPasswordConfirmation: newPassword,
	});

    const updatedUser = await fakeUsersRepository.findById(user.id);

    await expect(
      bCryptHashProvider.compareHash(
        newPassword,
        updatedUser.password_hash
      )
    ).resolves.toBeTruthy();
  });

  it('should not be able to update password if wrong password provided', async () => {
	const password = 'fake-password';
	const wrongPassword = 'wrong-password';
	const newPassword = 'new-password';

    const user = await createUserService.execute({
      firstName: 'Fulano',
      lastName: 'De Tal',
      email: 'fulano@email.com',
      password: password,
    });

    await expect(
      updatePasswordService.execute({
		id: user.id,
        password: wrongPassword,
		newPassword: newPassword,
		newPasswordConfirmation: newPassword,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password if new password confirmation does not match', async () => {
    const password = 'fake-password';
	const newPassword = 'new-password';
	const wrongNewPasswordConfirmation = 'new-password-wrong';

	const user = await createUserService.execute({
      firstName: 'Fulano',
      lastName: 'De Tal',
      email: 'fulano@email.com',
      password: password,
    });

    await expect(
      updatePasswordService.execute({
		  id: user.id,
		  password: password,
		  newPassword: newPassword,
		  newPasswordConfirmation: wrongNewPasswordConfirmation,
	  })
    ).rejects.toBeInstanceOf(AppError);
  });
});
