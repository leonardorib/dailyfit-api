import User from '../entities/User';
import IUsersRepository from '../database/repositories/base/IUsersRepository';

interface IRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute({
    firstName,
    lastName,
    email,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password_hash: password,
    });

    return user;
  }
}
