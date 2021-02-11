import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import CreateUserService from '../services/CreateUserService';
import BCryptHashProvider from '../providers/BCryptHashProvider';
import UsersRepository from '../database/repositories/UsersRepository';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { firstName, lastName, email, password } = request.body;

    const usersRepository = new UsersRepository();
    const bcryptHashProvider = new BCryptHashProvider();

    const createUser = new CreateUserService(
      usersRepository,
      bcryptHashProvider
    );

    try {
      const user = await createUser.execute({
        firstName,
        lastName,
        email,
        password,
      });

      return response.json(classToClass(user));
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}
