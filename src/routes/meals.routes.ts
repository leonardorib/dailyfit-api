import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import MealsController from '../controllers/MealsController';
import authMiddleware from '../middlewares/authMiddleware';

const mealsController = new MealsController();

const mealsRouter = Router();

mealsRouter.use(authMiddleware);

mealsRouter.post(
  '/',
  celebrate({
    body: {
      name: Joi.string().required(),
      date: Joi.date().required(),
    },
  }),
  mealsController.create
);

export default mealsRouter;
