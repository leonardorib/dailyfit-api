import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';
import User from '../models/User';

interface IDecodedToken {
  user: Omit<User, 'password'>;
  iat: number;
  exp: number;
}

export default function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const header = request.headers.authorization;

  if (!header) {
    throw new AppError('Token not provided', 401);
  }

  const [, token] = header.split(' ');

  try {
    const decodedToken = jwt.verify(token, authConfig.privateKey);

    request.userId = (decodedToken as IDecodedToken).user.id;

    console.log(request.userId);

    return next();
  } catch (error) {
    throw new AppError('Invalid JWT token', 401);
  }
}
