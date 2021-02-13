import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import FoodsController from '../controllers/FoodsController';

const foodsRouter = Router();

const foodsController = new FoodsController();

foodsRouter.use(authMiddleware);

foodsRouter.get('/', foodsController.list);

export default foodsRouter;
