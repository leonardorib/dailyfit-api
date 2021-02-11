import { Router } from 'express';

import usersRouter from './users.routes';
import authRouter from './auth.routes';

import { errors } from 'celebrate';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/auth', authRouter);

routes.use(errors({ statusCode: 400 }));

export default routes;
