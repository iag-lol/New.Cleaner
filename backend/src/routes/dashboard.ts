import { Router } from 'express';
import { query } from '../db';

const router = Router();

router.get('/summary', async (_req, res) => {
  try {
    const [{ rows: totals }, topCleaners, terminalCounts, typeDist] = await Promise.all([
      query(
        `SELECT
            COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE) AS today,
            COUNT(*) FILTER (WHERE created_at >= date_trunc('week', NOW())) AS week,
            COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW())) AS month
         FROM cleaning_records`
      ),
      query(
        `SELECT u.name, cr.user_id, COUNT(*) AS total
         FROM cleaning_records cr
         JOIN users u ON u.id = cr.user_id
         GROUP BY cr.user_id, u.name
         ORDER BY total DESC
         LIMIT 5`
      ),
      query(
        `SELECT terminal, COUNT(*) AS total
         FROM cleaning_records
         GROUP BY terminal
         ORDER BY total DESC`
      ),
      query(
        `SELECT cleaning_type, COUNT(*) AS total
         FROM cleaning_records
         GROUP BY cleaning_type
         ORDER BY total DESC`
      ),
    ]);

    res.json({
      totals: totals[0],
      topCleaners: topCleaners.rows,
      byTerminal: terminalCounts.rows,
      byType: typeDist.rows,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating summary', error });
  }
});

router.get('/cleaner/:id', async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate } = req.query as Record<string, string>;
  const clauses: string[] = ['user_id = $1'];
  const values: any[] = [id];

  if (startDate) {
    values.push(startDate);
    clauses.push(`created_at >= $${values.length}`);
  }
  if (endDate) {
    values.push(endDate);
    clauses.push(`created_at <= $${values.length}`);
  }
  const where = `WHERE ${clauses.join(' AND ')}`;
  try {
    const [general, typeDist, stickers, graffiti] = await Promise.all([
      query(
        `SELECT COUNT(*) AS total FROM cleaning_records ${where}`,
        values
      ),
      query(
        `SELECT cleaning_type, COUNT(*) AS total
         FROM cleaning_records
         ${where}
         GROUP BY cleaning_type`,
        values
      ),
      query(
        `SELECT COUNT(*) FILTER (WHERE stickers_removed = true) AS stickers_true,
                COUNT(*) FILTER (WHERE stickers_removed = false) AS stickers_false
         FROM cleaning_records ${where}`,
        values
      ),
      query(
        `SELECT COUNT(*) FILTER (WHERE graffiti_removed = true) AS graffiti_true,
                COUNT(*) FILTER (WHERE graffiti_removed = false) AS graffiti_false
         FROM cleaning_records ${where}`,
        values
      ),
    ]);
    res.json({
      total: general.rows[0]?.total ?? 0,
      byType: typeDist.rows,
      stickers: stickers.rows[0],
      graffiti: graffiti.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating cleaner report', error });
  }
});

export default router;
