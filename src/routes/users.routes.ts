import { Router } from 'express';
import UsersController from '../controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get('/', (request, response) => response.json({ message: 'test' }));

usersRouter.post('/', usersController.create);

export default usersRouter;
