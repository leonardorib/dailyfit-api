import { addHours } from 'date-fns';

import ResetPasswordService from '../ResetPasswordService';
import CreateUserService from '../CreateUserService';
import GenerateForgotPasswordTokenService from '../GenerateForgotPasswordTokenService';

import FakeUsersRepository from '../../database/repositories/fakes/FakeUsersRepository';
import FakeTokensRepository from '../../database/repositories/fakes/FakeTokensRepository';

import BCryptHashProvider from '../../providers/BCryptHashProvider';
import EtherealMailProvider from '../../providers/EtherealMailProvider';

import AppError from '../../errors/AppError';
import User from '../../models/User';
import Token from '../../models/Token';
import addMinutes from 'date-fns/addMinutes';

let fakeUsersRepository: FakeUsersRepository;
let fakeTokensRepository: FakeTokensRepository;

let bCryptHashProvider: BCryptHashProvider;
let etherealMailProvider = new EtherealMailProvider();

let resetPasswordService: ResetPasswordService;
let createUserService: CreateUserService;
let generateForgotPasswordTokenService: GenerateForgotPasswordTokenService;

let user: User;
let token: Token;
const oldPassword = 'old-password';

describe('Reset Password', () => {
  const createUserAndSendRecoveryEmail = async () => {
    user = await createUserService.execute({
      firstName: 'Fulano',
      lastName: 'De Tal',
      email: 'fulano@email.com',
      password: oldPassword,
    });

    const response = await generateForgotPasswordTokenService.execute({
      email: user.email,
    });

    token = response.token;
  };

  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeTokensRepository = new FakeTokensRepository();
    etherealMailProvider = await new EtherealMailProvider().init();
    bCryptHashProvider = new BCryptHashProvider();
    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeTokensRepository,
      bCryptHashProvider
    );
    createUserService = new CreateUserService(
      fakeUsersRepository,
      bCryptHashProvider
    );
    generateForgotPasswordTokenService = new GenerateForgotPasswordTokenService(
      fakeTokensRepository,
      fakeUsersRepository,
      etherealMailProvider
    );
  });

  it('should be able to reset password', async () => {
    const newPassword = 'new-password';

    await createUserAndSendRecoveryEmail();

	const currentMoment = Date.now()

    const dateNowSpy = jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => currentMoment);


    await resetPasswordService.execute({
      email: user.email,
      tokenValue: token.value,
      newPassword: newPassword,
      newPasswordConfirmation: newPassword,
    });

	dateNowSpy.mockRestore();

    const updatedUser = await fakeUsersRepository.findById(user.id);

	const updatedToken = await fakeTokensRepository.findById(token.id);

	expect(updatedToken.expires_at.getTime()).toBeLessThan(addMinutes(currentMoment, 1).getTime());

    await expect(
      bCryptHashProvider.compareHash(newPassword, updatedUser.password_hash)
    ).resolves.toBeTruthy();

    await expect(
      bCryptHashProvider.compareHash(oldPassword, updatedUser.password_hash)
    ).resolves.toBeFalsy();
  });

  it('should throw error if user does not exist', async () => {
    const newPassword = 'new-password';

    await createUserAndSendRecoveryEmail();

    await expect(
      resetPasswordService.execute({
        email: 'non-registered-user@nonregistered.com',
        tokenValue: token.value,
        newPassword: newPassword,
        newPasswordConfirmation: newPassword,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error if user has no token', async () => {
    const newPassword = 'new-password';
    await createUserAndSendRecoveryEmail();

    await expect(
      resetPasswordService.execute({
        email: 'non-registered-user@nonregistered.com',
        tokenValue: token.value,
        newPassword: newPassword,
        newPasswordConfirmation: newPassword,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error if the token is not valid', async () => {
    const newPassword = 'new-password';
    await createUserAndSendRecoveryEmail();

    await expect(
      resetPasswordService.execute({
        email: user.email,
        tokenValue: 'invalid-token',
        newPassword: newPassword,
        newPasswordConfirmation: newPassword,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error if token is expired', async () => {
    const newPassword = 'new-password';
    await createUserAndSendRecoveryEmail();

    const twoHoursFromNowTimestamp = addHours(new Date(), 2).getTime();

    const dateNowSpy = jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => twoHoursFromNowTimestamp);

    await expect(
      resetPasswordService.execute({
        email: user.email,
        tokenValue: token.value,
        newPassword: newPassword,
        newPasswordConfirmation: newPassword,
      })
    ).rejects.toBeInstanceOf(AppError);

    dateNowSpy.mockRestore();
  });

  it('should throw error if password does not match', async () => {
    const newPassword = 'new-password';
    const wrongPassword = 'wrong-password-confirmation';
    await createUserAndSendRecoveryEmail();

    await expect(
      resetPasswordService.execute({
        email: user.email,
        tokenValue: token.value,
        newPassword: newPassword,
        newPasswordConfirmation: wrongPassword,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should throw error if user has no token', async () => {
    const newPassword = 'new-password';

    user = await createUserService.execute({
      firstName: 'Fulano',
      lastName: 'De Tal',
      email: 'fulano@email.com',
      password: oldPassword,
    });

    await expect(
      resetPasswordService.execute({
        email: user.email,
        tokenValue: 'inexistent-token',
        newPassword: newPassword,
        newPasswordConfirmation: newPassword,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
