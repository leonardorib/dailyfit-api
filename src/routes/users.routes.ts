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

// Forgot password
usersRouter.post(
	'/forgotpassword',
	celebrate({
	  [Segments.BODY]: Joi.object().keys({
		email: Joi.string().email().required(),
	  }),
	}),
	usersController.forgotPassword
);

// Reset password
usersRouter.post(
	'/resetpassword',
	celebrate({
	  [Segments.BODY]: Joi.object().keys({
		email: Joi.string().email().required(),
		token: Joi.string().required(),
		newPassword: Joi.string().required().min(5),
        newPasswordConfirmation: Joi.string().required().valid(Joi.ref('newPassword')),
	  }),
	}),
	usersController.resetPassword
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
      })
  }),
  usersController.update
);

// Password Update
usersRouter.put(
	'/password',
	celebrate({
	  [Segments.BODY]: Joi.object()
		.keys({
		  password: Joi.string().required(),
		  newPassword: Joi.string().min(5).required(),
		  newPasswordConfirmation: Joi.string().valid(Joi.ref('newPassword')).required(),
		})
	}),
	usersController.updatePassword
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
