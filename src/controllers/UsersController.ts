import { Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';
import UsersRepository from '../database/repositories/UsersRepository';
import { classToClass } from 'class-transformer';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { firstName, lastName, email, password } = request.body;

    const usersRepository = new UsersRepository();

    const createUser = new CreateUserService(usersRepository);

    const user = await createUser.execute({
      firstName,
      lastName,
      email,
      password,
    });

    return response.json(classToClass(user));
  }
}
