import { Router } from 'express';

import usersRouter from './users.routes';

import { errors } from 'celebrate';

const routes = Router();

routes.use('/users', usersRouter);

routes.use(errors({ statusCode: 400 }));

export default routes;
