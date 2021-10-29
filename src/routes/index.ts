import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

import usersRouter from './users.routes';
import authRouter from './auth.routes';
import foodsRouter from './foods.routes';
import mealsRouter from './meals.routes';
import mealFoodsRouter from './mealFoods.routes';

const swaggerDocs = yaml.load('swagger.yaml');

import { errors } from 'celebrate';

const routes = Router();


routes.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

routes.use('/users', usersRouter);
routes.use('/auth', authRouter);
routes.use('/foods', foodsRouter);
routes.use('/meals', mealsRouter);
routes.use('/mealfoods', mealFoodsRouter);

routes.use(errors({ statusCode: 400 }));

export default routes;
