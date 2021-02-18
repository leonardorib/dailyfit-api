import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import MealFoodsController from '../controllers/MealFoodsController';

const mealFoodsRouter = Router();
const mealsFoodsController = new MealFoodsController();

mealFoodsRouter.use(authMiddleware);

mealFoodsRouter.post(
  '/',
  celebrate({
    body: {
      mealId: Joi.string().uuid().required(),
      foodId: Joi.string().uuid().required(),
      quantity: Joi.number().required(),
      quantity_unit: Joi.string().required(),
    },
  }),
  mealsFoodsController.create
);

mealFoodsRouter.delete(
  '/:mealFoodId',
  celebrate({
    params: {
      mealFoodId: Joi.string().uuid().required(),
    },
  }),
  mealsFoodsController.delete
);

export default mealFoodsRouter;
