import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { runMigrations, healthCheck } from './db';
import usersRouter from './routes/users';
import cleaningRouter from './routes/cleaning';
import tasksRouter from './routes/tasks';
import inspectionsRouter from './routes/inspections';
import dashboardRouter from './routes/dashboard';
import breaksRouter from './routes/breaks';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const allowOrigins = process.env.ALLOW_ORIGINS
  ? process.env.ALLOW_ORIGINS.split(',').map((s) => s.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: allowOrigins,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.get('/api/health', async (_req, res) => {
  try {
    await healthCheck();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
});

app.use('/api/users', usersRouter);
app.use('/api/registrations', cleaningRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/inspections', inspectionsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/breaks', breaksRouter);

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

async function start() {
  await runMigrations();
  app.listen(port, () => {
    console.log(`API running on port ${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
