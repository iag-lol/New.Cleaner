import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { query } from '../db';
import { User, UserRole } from '../types';

const router = Router();

router.get('/', async (req, res) => {
  const role = req.query.role as UserRole | undefined;
  try {
    const result = role
      ? await query<User>('SELECT * FROM users WHERE role = $1 ORDER BY name', [role])
      : await query<User>('SELECT * FROM users ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

router.post('/', async (req, res) => {
  const { name, role } = req.body as { name?: string; role?: UserRole };
  if (!name || !role) {
    return res.status(400).json({ message: 'name and role are required' });
  }
  try {
    const existing = await query<User>('SELECT * FROM users WHERE LOWER(name) = LOWER($1)', [name]);
    if (existing.rows.length) {
      return res.json(existing.rows[0]);
    }
    const id = uuid();
    const inserted = await query<User>(
      'INSERT INTO users (id, name, role) VALUES ($1, $2, $3) RETURNING *',
      [id, name.trim(), role]
    );
    res.status(201).json(inserted.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

export default router;
