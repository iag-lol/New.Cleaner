import { Router, Request, Response } from 'express';
import { eventManager } from '../events';

const router = Router();

router.get('/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'SSE connection established' })}\n\n`);

  eventManager.addClient(res);

  req.on('close', () => {
    res.end();
  });
});

router.get('/status', (req: Request, res: Response) => {
  res.json({
    clients: eventManager.getClientCount(),
    status: 'ok'
  });
});

export default router;
