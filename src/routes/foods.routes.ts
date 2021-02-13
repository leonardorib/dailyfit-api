import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import FoodsController from '../controllers/FoodsController';
import { celebrate, Joi, Segments } from 'celebrate';

const foodsRouter = Router();

const foodsController = new FoodsController();

foodsRouter.use(authMiddleware);

foodsRouter.get(
  '/',
  celebrate({
    query: Joi.object().keys({
      foodName: Joi.string(),
    }),
  }),
  foodsController.list
);

export default foodsRouter;
