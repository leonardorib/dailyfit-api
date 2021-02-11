import User from '../models/User';
import jwt, { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';
import IUsersRepository from '../database/repositories/base/IUsersRepository';
import IHashProvider from '../providers/base/IHashProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export default class AuthenticateService {
  private usersRepository: IUsersRepository;
  private hashProvider: IHashProvider;

  constructor(usersRepository: IUsersRepository, hashProvider: IHashProvider) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    // Check if user exists
    const user = await this.usersRepository.findOneByEmail(email);

    if (!user) {
      throw new Error('User does not exist or credentials are wrong');
    }

    // Check password
    const passwordMatch = await this.hashProvider.compareHash(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      throw new Error('User does not exist or credentials are wrong');
    }

    const token = jwt.sign(
      { user: classToClass(user) },
      authConfig.privateKey,
      authConfig.options
    );

    return { user, token };
  }
}
