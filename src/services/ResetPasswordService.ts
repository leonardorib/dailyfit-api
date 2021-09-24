import { isAfter } from 'date-fns';
import IUsersRepository from '../database/repositories/base/IUsersRepository';
import ITokensRepository from '../database/repositories/base/ITokensRepository';
import AppError from '../errors/AppError';
import User from '../models/User';
import IHashProvider from '../providers/base/IHashProvider';

interface IRequest {
  email: string;
  tokenValue: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export default class UpdatePasswordService {
  private usersRepository: IUsersRepository;
  private tokensRepository: ITokensRepository;
  private hashProvider: IHashProvider;

  constructor(
    usersRepository: IUsersRepository,
    tokensRepository: ITokensRepository,
    hashProvider: IHashProvider
  ) {
    this.usersRepository = usersRepository;
    this.tokensRepository = tokensRepository;
    this.hashProvider = hashProvider;
  }

  public async execute(resetPasswordData: IRequest): Promise<User> {
    const {
      email,
      tokenValue,
      newPassword,
      newPasswordConfirmation,
    } = resetPasswordData;

    const user = await this.usersRepository.findOneByEmail(email);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const tokenFound = await this.tokensRepository.findByUserId(user.id);

    if (!tokenFound) {
      throw new AppError('Invalid token', 401);
    }

    const isTokenFromUser = tokenFound.value === tokenValue;

    if (!isTokenFromUser) {
      throw new AppError('Invalid token', 401);
    }

    if (newPassword !== newPasswordConfirmation) {
      throw new AppError('Password confirmation does not match', 400);
    }

    const isTokenExpired = isAfter(Date.now(), tokenFound.expires_at);

    if (isTokenExpired) {
      throw new AppError('Token expired', 401);
    }

    const newPasswordHash = await this.hashProvider.createHash(newPassword);

    user.password_hash = newPasswordHash;

    const updatedUser = await this.usersRepository.save(user);

	tokenFound.expires_at = new Date();

	await this.tokensRepository.save(tokenFound);

    return updatedUser;
  }
}
