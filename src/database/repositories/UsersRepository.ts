import { getRepository, Repository } from 'typeorm';

import User from '../../models/User';
import IUsersRepository from './base/IUsersRepository';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }

  public async findOneByEmail(email: string): Promise<boolean> {
    const user = this.ormRepository.findOne({ where: { email } });

    return !!user;
  }
}

export default UsersRepository;
