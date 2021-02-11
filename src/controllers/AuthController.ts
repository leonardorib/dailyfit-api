import { Request, Response } from 'express';
import AuthenticateService from '../services/AuthenticateService';
import BCryptHashProvider from '../providers/BCryptHashProvider';
import UsersRepository from '../database/repositories/UsersRepository';
import { classToClass } from 'class-transformer';

export default class AuthController {
  public async create(request: Request, response: Response) {
    const bCryptHashProvider = new BCryptHashProvider();
    const usersRepository = new UsersRepository();

    const authenticateService = new AuthenticateService(
      usersRepository,
      bCryptHashProvider
    );
    const { email, password } = request.body;

    try {
      const { user, token } = await authenticateService.execute({
        email,
        password,
      });

      return response.json({ user: classToClass(user), token });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}
