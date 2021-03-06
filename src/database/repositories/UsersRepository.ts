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

  public async save(user: User): Promise<User> {
    const savedUser = await this.ormRepository.save(user);

    return savedUser;
  }

  public async deleteUserById(id: string): Promise<User> {
    const user = await this.ormRepository.findByIds([id]);

    await this.ormRepository.remove(user);

    return user[0];
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findOneByEmail(email: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne({ where: { email } });

    return user;
  }
}

export default UsersRepository;
