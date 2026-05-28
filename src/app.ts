import express from 'express';
import ErrorMiddleware from './middlewares/errorMiddleware.js';
import { router as UserRouter } from './routes/userRoutes.js';

const app = express();
app.use(express.json());

app.get('/hcheck', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

app.use('/api/v1/users', UserRouter);
app.use(ErrorMiddleware);

export default app;
