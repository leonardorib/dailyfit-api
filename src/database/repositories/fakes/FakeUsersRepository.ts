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

  public async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(
      (userInRepository) => userInRepository.id === user.id
    );

    this.users[userIndex] = user;

    return this.users[userIndex];
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.id === id);

    return user;
  }

  public async deleteUserById(id: string): Promise<User> {
    const userFound = this.users.find((user) => user.id === id);

    this.users = this.users.filter((user) => user.id !== id);

    return userFound;
  }

  public async findOneByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === email);

    return user;
  }
}

export default FakeUsersRepository;
