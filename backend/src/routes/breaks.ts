import { Router } from 'express';
import { query } from '../db';
import { BreakAssignment } from '../types';

const router = Router();

router.get('/', async (req, res) => {
  const userId = req.query.userId as string | undefined;
  try {
    if (userId) {
      const result = await query<BreakAssignment>(
        'SELECT * FROM break_assignments WHERE user_id = $1',
        [userId]
      );
      return res.json(result.rows[0] ?? null);
    }
    const result = await query(
      `SELECT ba.*, u.name, u.role
       FROM break_assignments ba
       JOIN users u ON u.id = ba.user_id
       ORDER BY u.name`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching break assignments', error });
  }
});

router.post('/', async (req, res) => {
  const { userId, breakTime } = req.body as { userId?: string; breakTime?: string | null };
  if (!userId) return res.status(400).json({ message: 'userId is required' });
  try {
    const result = await query<BreakAssignment>(
      `INSERT INTO break_assignments (user_id, break_time, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id) DO UPDATE SET break_time = $2, updated_at = NOW()
       RETURNING *`,
      [userId, breakTime]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error saving break assignment', error });
  }
});

export default router;
