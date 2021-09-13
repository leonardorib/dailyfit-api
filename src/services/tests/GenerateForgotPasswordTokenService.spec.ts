import Token from '../../models/Token';
import GenerateForgotPasswordTokenService from '../GenerateForgotPasswordTokenService';
import FakeTokensRepository from '../../database/repositories/fakes/FakeTokensRepository';
import FakeUsersRepository from '../../database/repositories/fakes/FakeUsersRepository';
import EtherealMailProvider from '../../providers/EtherealMailProvider';
import BCryptHashProvider from '../../providers/BCryptHashProvider';
import CreateUserService from '../CreateUserService';
import AppError from '../../errors/AppError';

let fakeTokensRepository: FakeTokensRepository;
let fakeUsersRepository: FakeUsersRepository;
let etherealMailProvider: EtherealMailProvider;
let bCryptHashProvider: BCryptHashProvider;
let generateForgotPasswordTokenService: GenerateForgotPasswordTokenService;
let createUserService: CreateUserService;

describe('Generate and send forgot password token', () => {
  const doBeforeEach = () => {
    fakeTokensRepository = new FakeTokensRepository();
    fakeUsersRepository = new FakeUsersRepository();
    bCryptHashProvider = new BCryptHashProvider();
    generateForgotPasswordTokenService = new GenerateForgotPasswordTokenService(
      fakeTokensRepository,
      fakeUsersRepository,
      etherealMailProvider
    );
    createUserService = new CreateUserService(
      fakeUsersRepository,
      bCryptHashProvider
    );
  };

  const doBeforeAll = async () => {
    etherealMailProvider = await new EtherealMailProvider().init();
    doBeforeEach();
  };

  beforeAll(doBeforeAll);

  beforeEach(doBeforeEach);

  it('should be able to send a password token to user', async () => {
    const user = await createUserService.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@test.com',
      password: 'password123',
    });

    const sendMailSpy = jest.spyOn(etherealMailProvider, 'sendMail');

    const { token } = await generateForgotPasswordTokenService.execute({
      email: user.email,
    });

    expect(sendMailSpy).toHaveBeenCalledTimes(1);
    expect(sendMailSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
        },
      })
    );
    expect(sendMailSpy).toHaveReturned();
    sendMailSpy.mockReset();

    expect(token).toBeInstanceOf(Token);
    expect(token.user_id).toBe(user.id);
  });

  it('should update the existing token if a previous one was registered', async () => {
    const user = await createUserService.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@test.com',
      password: 'password123',
    });

    const {
      token: oldToken,
    } = await generateForgotPasswordTokenService.execute({
      email: user.email,
    });

    const {
      token: newToken,
    } = await generateForgotPasswordTokenService.execute({
      email: user.email,
    });

    const foundToken = await fakeTokensRepository.findByUserId(user.id);

    expect(foundToken).not.toMatchObject(oldToken);
    expect(foundToken).toMatchObject(newToken);
  });

  it('should not be able to send a token to an non registered email', async () => {
    await expect(
      generateForgotPasswordTokenService.execute({
        email: 'non-registered-email@nonregistered.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
