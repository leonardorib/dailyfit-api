import { Router } from 'express';

import usersRouter from './users.routes';
import authRouter from './auth.routes';
import foodsRouter from './foods.routes';
import mealsRouter from './meals.routes';

import { errors } from 'celebrate';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/auth', authRouter);
routes.use('/foods', foodsRouter);
routes.use('/meals', mealsRouter);

routes.use(errors({ statusCode: 400 }));

export default routes;
