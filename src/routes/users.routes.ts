import { Router } from 'express';
import UsersController from '../controllers/UsersController';
import { celebrate, Joi, Segments } from 'celebrate';

import authMiddleware from '../middlewares/authMiddleware';

const usersRouter = Router();
const usersController = new UsersController();

// User creation - Sign Up
usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(5),
      passwordConfirmation: Joi.string().required().valid(Joi.ref('password')),
    }),
  }),
  usersController.create
);

// Checks authentication - Private routes
usersRouter.use(authMiddleware);

// Profile Update
usersRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object()
      .keys({
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string().required(),
        newPassword: Joi.string().min(5),
        newPasswordConfirmation: Joi.string().valid(Joi.ref('newPassword')),
      })
      .with('newPassword', ['newPasswordConfirmation']),
  }),
  usersController.update
);

// Account delete
usersRouter.delete(
  '/:user_id',
  celebrate({
    [Segments.BODY]: Joi.object()
      .keys({
        password: Joi.string().required(),
      })
      .with('newPassword', ['newPasswordConfirmation']),

    [Segments.PARAMS]: Joi.object().keys({
      user_id: Joi.string().uuid().required(),
    }),
  }),
  usersController.delete
);

export default usersRouter;
