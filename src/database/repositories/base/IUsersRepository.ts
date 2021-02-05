import User from '../../entities/User';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
}
