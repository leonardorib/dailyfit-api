import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import 'reflect-metadata';
import 'dotenv/config';

import './database';
import routes from './routes';
import AppError from './errors/AppError';

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

app.use(function (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  return response.status(500).json({ message: error.message });
});

app.listen(3333, () => {
  console.log('DailyFit server started on port 3333!');
});
