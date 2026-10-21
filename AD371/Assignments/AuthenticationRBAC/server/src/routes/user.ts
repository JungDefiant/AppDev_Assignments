import { Router } from 'express';
import { authenticate } from '../middleware/auth.ts';
import * as users from '../store/users.ts';

export const userRouter = Router();

// Every route mounted under this router requires a valid JWT.
// That makes this the "protected" tier: any authenticated user, any role.
userRouter.use(authenticate);

// GET /api/user/profile — PROTECTED tier: any authenticated user (User or Admin).
userRouter.get('/profile', (req, res) => {
  const claims = req.user;
  if (claims === undefined) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }
  const record = users.findById(claims.id);
  if (record === undefined) {
    res.status(401).json({ error: 'Account no longer exists.' });
    return;
  }
  const accountAgeDays = Math.max(
    0,
    Math.floor((Date.now() - record.createdAt.getTime()) / 86_400_000),
  );
  res.json({
    message: `Welcome back, ${record.username}! You can see this because you are authenticated.`,
    user: users.toSafeUser(record),
    accountAgeDays,
  });
});
