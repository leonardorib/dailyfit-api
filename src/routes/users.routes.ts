import { Router } from 'express';
import UsersController from '../controllers/UsersController';
import { celebrate, Joi, Segments } from 'celebrate';

import authMiddleware from '../middlewares/authMiddleware';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get('/', (request, response) => response.json({ message: 'test' }));

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(5),
    }),
  }),
  usersController.create
);

export default usersRouter;
