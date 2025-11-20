import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { query } from '../db';
import { Task } from '../types';

const router = Router();

router.post('/', async (req, res) => {
  const { cleanerId, supervisorId, content, title } = req.body as {
    cleanerId?: string;
    supervisorId?: string;
    content?: string;
    title?: string;
  };
  if (!cleanerId || !supervisorId || !content) {
    return res.status(400).json({ message: 'cleanerId, supervisorId and content are required' });
  }
  try {
    const id = uuid();
    const inserted = await query<Task>(
      `INSERT INTO tasks (id, cleaner_id, supervisor_id, content, title, status)
       VALUES ($1,$2,$3,$4,$5,'pending') RETURNING *`,
      [id, cleanerId, supervisorId, content, title]
    );
    res.status(201).json(inserted.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
});

router.get('/', async (req, res) => {
  const { cleanerId, status, startDate, endDate } = req.query as Record<string, string>;
  const clauses: string[] = [];
  const values: any[] = [];

  if (cleanerId) {
    values.push(cleanerId);
    clauses.push(`cleaner_id = $${values.length}`);
  }
  if (status) {
    values.push(status);
    clauses.push(`status = $${values.length}`);
  }
  if (startDate) {
    values.push(startDate);
    clauses.push(`created_at >= $${values.length}`);
  }
  if (endDate) {
    values.push(endDate);
    clauses.push(`created_at <= $${values.length}`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const sql = `SELECT * FROM tasks ${where} ORDER BY created_at DESC LIMIT 200`;
  try {
    const result = await query<Task>(sql, values);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});

router.patch('/:id/complete', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query<Task>(
      `UPDATE tasks SET status = 'done', completed_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Task not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});

export default router;
