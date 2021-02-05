import User from '../models/User';
import IUsersRepository from '../database/repositories/base/IUsersRepository';
import IHashProvider from '../providers/base/IHashProvider';

interface IRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  private usersRepository: IUsersRepository;
  private hashProvider: IHashProvider;

  constructor(usersRepository: IUsersRepository, hashProvider: IHashProvider) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({
    firstName,
    lastName,
    email,
    password,
  }: IRequest): Promise<User> {
    const passwordHash = await this.hashProvider.createHash(password);

    const user = await this.usersRepository.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password_hash: passwordHash,
    });

    return user;
  }
}
