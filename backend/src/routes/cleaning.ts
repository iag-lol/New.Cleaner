import { Router } from 'express';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import { query } from '../db';
import { uploadBuffer } from '../utils/storage';
import { CleaningRecord } from '../types';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  upload.fields([
    { name: 'imageFront', maxCount: 1 },
    { name: 'imageBack', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const body = req.body as Record<string, string>;
      const userId = body.userId;
      const ppu = body.ppu;
      const busNumber = body.busNumber;
      const terminal = body.terminal;
      const cleaningType = body.cleaningType;
      const stickersRemoved = body.stickersRemoved === 'true';
      const graffitiRemoved = body.graffitiRemoved === 'true';

      if (!userId || !ppu || !busNumber || !terminal || !cleaningType) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const frontFile = files?.imageFront?.[0];
      const backFile = files?.imageBack?.[0];

      const [frontUrl, backUrl] = await Promise.all([
        uploadBuffer(frontFile, 'cleaning'),
        uploadBuffer(backFile, 'cleaning'),
      ]);

      const id = uuid();
      const inserted = await query<CleaningRecord>(
        `INSERT INTO cleaning_records
        (id, user_id, ppu, bus_number, terminal, cleaning_type, stickers_removed, graffiti_removed, image_front_url, image_back_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [
          id,
          userId,
          ppu.trim(),
          busNumber.trim(),
          terminal,
          cleaningType,
          stickersRemoved,
          graffitiRemoved,
          frontUrl,
          backUrl,
        ]
      );

      res.status(201).json(inserted.rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error creating cleaning record', error });
    }
  }
);

router.get('/', async (req, res) => {
  const { userId, terminal, cleaningType, startDate, endDate, ppu } = req.query as Record<
    string,
    string
  >;
  const clauses: string[] = [];
  const values: any[] = [];

  if (userId) {
    values.push(userId);
    clauses.push(`user_id = $${values.length}`);
  }
  if (terminal) {
    values.push(terminal);
    clauses.push(`terminal = $${values.length}`);
  }
  if (cleaningType) {
    values.push(cleaningType);
    clauses.push(`cleaning_type = $${values.length}`);
  }
  if (ppu) {
    values.push(ppu);
    clauses.push(`ppu ILIKE $${values.length}`);
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
  const sql = `SELECT * FROM cleaning_records ${where} ORDER BY created_at DESC LIMIT 200`;

  try {
    const result = await query<CleaningRecord>(sql, values);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching records', error });
  }
});

router.get('/recent/ppu', async (req, res) => {
  const userId = req.query.userId as string | undefined;
  if (!userId) return res.status(400).json({ message: 'userId is required' });
  try {
    const result = await query(
      `SELECT DISTINCT ppu, bus_number
       FROM cleaning_records WHERE user_id = $1
       ORDER BY created_at DESC LIMIT 8`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent PPU', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query<CleaningRecord>('SELECT * FROM cleaning_records WHERE id = $1', [
      id,
    ]);
    if (!result.rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching record', error });
  }
});

export default router;
