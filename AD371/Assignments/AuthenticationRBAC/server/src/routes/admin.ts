import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.ts';
import * as users from '../store/users.ts';

export const adminRouter = Router();

// RESTRICTED tier: authenticate first, then enforce the RBAC rule.
// `authenticate` verifies the JWT; `requireRole('admin')` checks the role
// claim and rejects non-admins with 403. Order matters: authn before authz.
adminRouter.use(authenticate, requireRole('admin'));

// GET /api/admin/users — list all accounts (password hashes are never included).
adminRouter.get('/users', (_req, res) => {
  res.json({ users: users.listUsers() });
});

// DELETE /api/admin/users/:id — remove an account by id.
adminRouter.delete('/users/:id', (req, res) => {
  const targetId = req.params.id;
  const actingUser = req.user;

  if (actingUser !== undefined && actingUser.id === targetId) {
    // Guard rail: an admin cannot delete their own account (they would lock
    // themselves out and could orphan the system with no admins left).
    res.status(400).json({ error: 'You cannot delete your own account.' });
    return;
  }

  const deleted = users.deleteUser(targetId);
  if (!deleted) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }
  console.log(`[admin] user ${targetId} deleted by ${actingUser?.username ?? 'unknown'}`);
  res.json({ deleted: true, id: targetId });
});

// GET /api/admin/metrics — system metrics, admin only.
adminRouter.get('/metrics', (_req, res) => {
  const all = users.listUsers();
  res.json({
    totalUsers: all.length,
    adminUsers: all.filter((u) => u.role === 'admin').length,
    userUsers: all.filter((u) => u.role === 'user').length,
    uptimeSeconds: Math.round(process.uptime()),
    memoryRssMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
    timestamp: new Date().toISOString(),
  });
});
