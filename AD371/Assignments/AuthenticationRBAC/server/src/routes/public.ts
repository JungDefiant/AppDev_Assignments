import { Router } from 'express';
import { userCount } from '../store/users.ts';

export const publicRouter = Router();

// GET /api/public/stats — PUBLIC tier: no authentication required.
publicRouter.get('/stats', (_req, res) => {
  res.json({
    message: 'This endpoint is public — anyone (even without an account) can call it.',
    registeredUsers: userCount(),
    serverTime: new Date().toISOString(),
  });
});
