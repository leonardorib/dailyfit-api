import IUsersRepository from '../database/repositories/base/IUsersRepository';
import AppError from '../errors/AppError';
import User from '../models/User';
import IHashProvider from '../providers/base/IHashProvider';

interface IRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  newPassword?: string;
  newPasswordConfirmation?: string;
}

export default class UpdateUserProfileService {
  private usersRepository: IUsersRepository;
  private hashProvider: IHashProvider;

  constructor(usersRepository: IUsersRepository, hashProvider: IHashProvider) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async execute(userData: IRequest): Promise<User> {
    const {
      id,
      firstName,
      lastName,
      email,
      password,
      newPassword,
      newPasswordConfirmation,
    } = userData;

    const user = await this.usersRepository.findById(id);

    const doesPasswordMatch = await this.hashProvider.compareHash(
      password,
      user.password_hash
    );

    if (!doesPasswordMatch) {
      throw new AppError('Password does not match', 401);
    }

    // Email must be unique
    if (email !== user.email) {
      const findUserByEmail = await this.usersRepository.findOneByEmail(email);

      if (findUserByEmail) {
        throw new AppError('Email already in use', 400);
      }
    }

    // If there is password change
    if (newPassword) {
      if (newPassword !== newPasswordConfirmation) {
        throw new AppError('Password confirmation does not match', 400);
      }
      const newPasswordHash = await this.hashProvider.createHash(newPassword);

      user.password_hash = newPasswordHash;
    }

    user.email = email;
    user.first_name = firstName;
    user.last_name = lastName;

    const updatedUser = await this.usersRepository.save(user);

    return updatedUser;
  }
}
