import express from 'express';
import ErrorMiddleware from './middlewares/errorMiddleware.js';

const app = express();

app.get('/hcheck', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

app.use(ErrorMiddleware);

export default app;
