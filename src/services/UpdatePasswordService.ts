import IUsersRepository from '../database/repositories/base/IUsersRepository';
import AppError from '../errors/AppError';
import User from '../models/User';
import IHashProvider from '../providers/base/IHashProvider';

interface IRequest {
  id: string;
  password: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export default class UpdatePasswordService {
  private usersRepository: IUsersRepository;
  private hashProvider: IHashProvider;

  constructor(usersRepository: IUsersRepository, hashProvider: IHashProvider) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async execute(updatePasswordData: IRequest): Promise<User> {
    const {
      id,
      password,
      newPassword,
      newPasswordConfirmation,
    } = updatePasswordData;

    const user = await this.usersRepository.findById(id);

	if (!user) {
	  throw new AppError('User was not found', 404);
	}

    const doesPasswordMatch = await this.hashProvider.compareHash(
      password,
      user.password_hash
    );

    if (!doesPasswordMatch) {
      throw new AppError('Password does not match', 401);
    }

    if (newPassword !== newPasswordConfirmation) {
        throw new AppError('Password confirmation does not match', 400);
      }

	const newPasswordHash = await this.hashProvider.createHash(newPassword);

    user.password_hash = newPasswordHash;

    const updatedUser = await this.usersRepository.save(user);

    return updatedUser;
  }
}
