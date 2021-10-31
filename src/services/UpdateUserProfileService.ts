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
    } = userData;

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

    // Email must be unique
	const isModifyingEmail = email !== user.email;

    if (isModifyingEmail) {
      const findUserByEmail = await this.usersRepository.findOneByEmail(email);

      if (findUserByEmail) {
        throw new AppError('Email already in use', 400);
      }
    }

    user.email = email;
    user.first_name = firstName;
    user.last_name = lastName;

    const updatedUser = await this.usersRepository.save(user);

    return updatedUser;
  }
}
