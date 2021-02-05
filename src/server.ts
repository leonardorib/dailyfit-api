import express from 'express';
import 'reflect-metadata';

import './database';
import routes from './routes';

require('dotenv');

const app = express();

app.use(express.json());

app.use(routes);

app.listen(3333, () => {
  console.log('DailyFit server started on port 3333!');
});
