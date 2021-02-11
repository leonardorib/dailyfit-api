import User from '../../../models/User';
import IUsersRepository from '../base/IUsersRepository';
import ICreateUserDTO from '../../../dtos/ICreateUserDTO';
import { v4 as uuid } from 'uuid';

class FakeUsersRepository implements IUsersRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, { ...userData });

    this.users.push(user);

    return user;
  }

  public async findOneByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === email);

    return user;
  }
}

export default FakeUsersRepository;
