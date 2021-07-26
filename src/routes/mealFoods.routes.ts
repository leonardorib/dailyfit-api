import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import MealFoodsController from '../controllers/MealFoodsController';

const mealFoodsRouter = Router();
const mealsFoodsController = new MealFoodsController();

mealFoodsRouter.use(authMiddleware);

mealFoodsRouter.get(
	'/:mealFoodId',
	celebrate({
	  params: {
		mealFoodId: Joi.string().required().uuid(),
	  },
	}),
	mealsFoodsController.get
  );

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

mealFoodsRouter.put(
  '/:mealFoodId',
  celebrate({
    params: {
      mealFoodId: Joi.string().uuid().required(),
    },
    body: {
      foodId: Joi.string().uuid(),
      quantity: Joi.number().greater(0),
    },
  }),
  mealsFoodsController.update
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
