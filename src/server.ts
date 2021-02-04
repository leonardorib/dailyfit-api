import express from 'express';
import 'reflect-metadata';

require('dotenv');

const app = express();

app.get('/', (request, response) => response.json({ message: 'Hello World' }));

app.listen(3333, () => {
  console.log('DailyFit server started on port 3333!');
});
