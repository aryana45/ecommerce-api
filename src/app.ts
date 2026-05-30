import express from 'express';
import ErrorMiddleware from './middlewares/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import { router as UserRouter } from './routes/userRoutes.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/hcheck', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

app.use('/api/v1/users', UserRouter);
app.use(ErrorMiddleware);

export default app;
