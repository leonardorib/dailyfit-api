import { NextFunction, Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import CreateUserService from '../services/CreateUserService';
import GenerateForgotPasswordTokenService from '../services/GenerateForgotPasswordTokenService';
import BCryptHashProvider from '../providers/BCryptHashProvider';
import EtherealMailProvider from '../providers/EtherealMailProvider';
import SparkpostMailProvider from '../providers/SparkpostMailProvider';
import UsersRepository from '../database/repositories/UsersRepository';
import TokensRepository from '../database/repositories/TokensRepository';
import UpdateUserProfileService from '../services/UpdateUserProfileService';
import UpdatePasswordService from '../services/UpdatePasswordService';
import DeleteUserService from '../services/DeleteUserService';

export default class UsersController {
  public async create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
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
      return next(error);
    }
  }

  public async update(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const userId = request.userId;

    const {
      firstName,
      lastName,
      email,
      password,
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
      });

      return response.json(classToClass(updatedUser));
    } catch (error) {
      return next(error);
    }
  }

  public async updatePassword(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const userId = request.userId;

    const {
      password,
      newPassword,
      newPasswordConfirmation,
    } = request.body;

    const usersRepository = new UsersRepository();
    const bcryptHashProvider = new BCryptHashProvider();

    const updatePassword = new UpdatePasswordService(
      usersRepository,
      bcryptHashProvider
    );

    try {
      const updatedUser = await updatePassword.execute({
        id: userId,
        password,
		newPassword,
		newPasswordConfirmation,
      });

      return response.json(classToClass(updatedUser));
    } catch (error) {
      return next(error);
    }
  }

  public async delete(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const usersRepository = new UsersRepository();
    const bcryptHashProvider = new BCryptHashProvider();

    const deleteUserService = new DeleteUserService(
      usersRepository,
      bcryptHashProvider
    );

    const { user_id } = request.params;

    const { password } = request.body;

    try {
      const user = await deleteUserService.execute({
        userId: user_id,
        password,
      });

      return response.json(classToClass(user));
    } catch (error) {
      return next(error);
    }
  }

  public async forgotPassword(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const usersRepository = new UsersRepository();
	const tokensRepository = new TokensRepository();

    const { email } = request.body;

    try {
	  const mailProvider =
      process.env.NODE_ENV === "production"
	  	? new SparkpostMailProvider()
        : await new EtherealMailProvider().init();

      const generateTokenService = new GenerateForgotPasswordTokenService(
        tokensRepository,
        usersRepository,
	    mailProvider,
      );

      await generateTokenService.execute({
        email,
      });

	  const responseMessage =
        process.env.NODE_ENV === 'production'
	      ? 'Password recovery email has been sent successfully'
          : '[DEVELOPMENT MODE] Password recovery test email has been sent successfully, check application logs';

      return response.json({ message: responseMessage });
    } catch (error) {
      return next(error);
    }
  }
}
