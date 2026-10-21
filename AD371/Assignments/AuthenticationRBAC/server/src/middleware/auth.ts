import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.ts';
import type { Role } from '../store/users.ts';

export interface AuthUser {
  id: string;
  username: string;
  role: Role;
}

interface TokenClaims extends jwt.JwtPayload {
  username?: unknown;
  role?: unknown;
}

/**
 * Authentication middleware.
 *
 * Verifies the `Authorization: Bearer <token>` header, validates the JWT
 * signature and expiry, and attaches the decoded identity to `req.user`.
 * Rejects with 401 when the token is missing, malformed, or invalid.
 */
export const authenticate: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  if (header === undefined || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required: missing bearer token.' });
    return;
  }

  try {
    const claims = jwt.verify(header.slice('Bearer '.length), config.jwtSecret) as TokenClaims;
    const { sub, username, role } = claims;
    if (
      typeof sub !== 'string' ||
      typeof username !== 'string' ||
      (role !== 'user' && role !== 'admin')
    ) {
      throw new Error('Unexpected token claims');
    }
    req.user = { id: sub, username, role };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

/**
 * Authorization middleware (RBAC).
 *
 * Must run AFTER `authenticate`. Allows the request through only if the
 * authenticated user holds one of the allowed roles; otherwise rejects with
 * 401 (not signed in) or 403 (signed in, but insufficient role).
 *
 * Usage:
 *   router.get('/users', authenticate, requireRole('admin'), handler)
 */
export function requireRole(...allowedRoles: Role[]): RequestHandler {
  return (req, res, next) => {
    const user = req.user;
    if (user === undefined) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        error: `Forbidden: this endpoint requires one of the following roles: ${allowedRoles.join(', ')}.`,
      });
      return;
    }
    next();
  };
}
