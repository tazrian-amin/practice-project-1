/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

//application routes
app.use('/api/v1', router);

const test = async (req: Request, res: Response) => {
  Promise.reject();
};

app.get('/', test);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World of Vercel!');
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
