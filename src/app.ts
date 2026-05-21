import express from 'express';

const app = express();

app.get('/hcheck', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

export default app;
