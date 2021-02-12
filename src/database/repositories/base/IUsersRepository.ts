import User from '../../../models/User';
import ICreateUserDTO from '../../../dtos/ICreateUserDTO';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;

  save(user: User): Promise<User>;

  findById(id: string): Promise<User | undefined>;

  findOneByEmail(email: string): Promise<User | undefined>;
}
