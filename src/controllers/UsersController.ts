import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import CreateUserService from '../services/CreateUserService';
import BCryptHashProvider from '../providers/BCryptHashProvider';
import UsersRepository from '../database/repositories/UsersRepository';
import UpdateUserProfileService from '../services/UpdateUserProfileService';

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

  public async update(request: Request, response: Response) {
    const userId = request.userId;

    const {
      firstName,
      lastName,
      email,
      password,
      newPassword,
      newPasswordConfirmation,
    } = request.body;

    const usersRepository = new UsersRepository();
    const bcryptHashProvider = new BCryptHashProvider();

    const updateUserProfile = new UpdateUserProfileService(
      usersRepository,
      bcryptHashProvider
    );

    try {
      const updatedUser = await updateUserProfile.execute({
        id: userId,
        firstName,
        lastName,
        email,
        password,
        newPassword,
        newPasswordConfirmation,
      });

      return response.json(classToClass(updatedUser));
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}
