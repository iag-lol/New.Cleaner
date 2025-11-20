import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { query } from '../db';

const router = Router();

router.post('/', async (req, res) => {
  const { cleaningId, supervisorId, passed, comments } = req.body as {
    cleaningId?: string;
    supervisorId?: string;
    passed?: boolean;
    comments?: string;
  };
  if (!cleaningId || !supervisorId || passed === undefined) {
    return res.status(400).json({ message: 'cleaningId, supervisorId and passed are required' });
  }
  try {
    const id = uuid();
    const result = await query(
      `INSERT INTO inspections (id, cleaning_id, supervisor_id, passed, comments)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [id, cleaningId, supervisorId, passed, comments]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating inspection', error });
  }
});

router.get('/', async (req, res) => {
  const { cleanerId, result, startDate, endDate } = req.query as Record<string, string>;
  const clauses: string[] = [];
  const values: any[] = [];

  if (cleanerId) {
    clauses.push(`cr.user_id = $${values.length + 1}`);
    values.push(cleanerId);
  }
  if (result) {
    clauses.push(`i.passed = $${values.length + 1}`);
    values.push(result === 'true');
  }
  if (startDate) {
    clauses.push(`i.created_at >= $${values.length + 1}`);
    values.push(startDate);
  }
  if (endDate) {
    clauses.push(`i.created_at <= $${values.length + 1}`);
    values.push(endDate);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  try {
    const resultQuery = await query(
      `SELECT i.*, cr.ppu, cr.terminal, u.name as supervisor_name
       FROM inspections i
       JOIN cleaning_records cr ON cr.id = i.cleaning_id
       JOIN users u ON u.id = i.supervisor_id
       ${where}
       ORDER BY i.created_at DESC`,
      values
    );
    res.json(resultQuery.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inspections', error });
  }
});

export default router;
