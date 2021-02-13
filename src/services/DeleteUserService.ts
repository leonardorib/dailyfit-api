import IUsersRepository from '../database/repositories/base/IUsersRepository';
import AppError from '../errors/AppError';
import User from '../models/User';
import IHashProvider from '../providers/base/IHashProvider';

interface IRequest {
  userId: string;
  password: string;
}

export default class DeleteUserService {
  private usersRepository: IUsersRepository;
  private hashProvider: IHashProvider;

  constructor(usersRepository: IUsersRepository, hashProvider: IHashProvider) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({ userId, password }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User does not exist', 400);
    }

    const isPasswordCorrect = await this.hashProvider.compareHash(
      password,
      user.password_hash
    );

    if (!isPasswordCorrect) {
      throw new AppError('Password does not match', 401);
    }

    const deletedUser = await this.usersRepository.deleteUserById(userId);

    return deletedUser;
  }
}
