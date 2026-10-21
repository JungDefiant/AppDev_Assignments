import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.ts';
import * as users from '../store/users.ts';
import { authenticate } from '../middleware/auth.ts';
import { fakeVerify, hashPassword, verifyPassword } from '../utils/passwords.ts';
import { loginThrottle } from '../utils/loginThrottle.ts';

export const authRouter = Router();

const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{3,30}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_PASSWORD_LENGTH = 10;
const MAX_PASSWORD_LENGTH = 128;

function issueToken(user: users.UserRecord): string {
  return jwt.sign({ username: user.username, role: user.role }, config.jwtSecret, {
    subject: user.id,
    expiresIn: config.jwtExpiresIn,
  });
}

interface RegisterBody {
  username?: unknown;
  email?: unknown;
  password?: unknown;
  role?: unknown;
  adminSignupCode?: unknown;
}

// POST /api/auth/register — public. Creates an account.
// The first account ever registered is auto-promoted to Admin (bootstrap);
// afterwards, Admin self-registration requires the ADMIN_SIGNUP_CODE secret.
authRouter.post('/register', async (req, res) => {
  const body = (req.body ?? {}) as RegisterBody;

  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const requestedRole: users.Role = body.role === 'admin' ? 'admin' : 'user';
  const adminSignupCode = typeof body.adminSignupCode === 'string' ? body.adminSignupCode : '';

  if (!USERNAME_PATTERN.test(username)) {
    res.status(400).json({
      error: 'Username must be 3-30 characters using letters, digits, "_" or "-".',
    });
    return;
  }
  if (!EMAIL_PATTERN.test(email)) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }
  if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    res
      .status(400)
      .json({ error: `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.` });
    return;
  }

  if (requestedRole === 'admin') {
    const isBootstrapAdmin = users.userCount() === 0;
    if (!isBootstrapAdmin && adminSignupCode !== config.adminSignupCode) {
      res
        .status(403)
        .json({ error: 'Admin registration requires a valid admin signup code.' });
      return;
    }
  }

  if (users.usernameOrEmailTaken(username, email)) {
    res.status(409).json({ error: 'Username or email is already registered.' });
    return;
  }

  // Only the bcrypt HASH is stored — the plaintext password is never persisted.
  // The first account ever registered bootstraps the system as Admin so there
  // is always at least one administrator.
  const effectiveRole: users.Role = users.userCount() === 0 ? 'admin' : requestedRole;
  const passwordHash = await hashPassword(password);
  const created = users.createUser({ username, email, passwordHash, role: effectiveRole });

  console.log(`[auth] registered ${created.username} (role: ${created.role})`);

  res.status(201).json({ token: issueToken(created), user: users.toSafeUser(created) });
});

interface LoginBody {
  username?: unknown;
  password?: unknown;
}

// POST /api/auth/login — public. Returns a signed JWT on success.
authRouter.post('/login', async (req, res) => {
  const body = (req.body ?? {}) as LoginBody;

  const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (username === '' || password === '') {
    res.status(400).json({ error: 'Username and password are required.' });
    return;
  }

  if (loginThrottle.isLocked(username)) {
    res
      .status(429)
      .json({ error: 'Too many failed login attempts. Please try again in a few minutes.' });
    return;
  }

  const record = users.findByUsername(username);
  if (record !== undefined) {
    const ok = await verifyPassword(password, record.passwordHash);
    if (ok) {
      loginThrottle.reset(username);
      console.log(`[auth] ${record.username} logged in (role: ${record.role})`);
      res.json({ token: issueToken(record), user: users.toSafeUser(record) });
      return;
    }
  } else {
    // Equalize timing so attackers cannot distinguish "no such user" from
    // "wrong password" (anti user-enumeration).
    await fakeVerify(password);
  }

  loginThrottle.recordFailure(username);
  // Same generic message for both failure modes — no information leak.
  res.status(401).json({ error: 'Invalid username or password.' });
});

// GET /api/auth/me — authenticated. Returns the caller's own profile.
authRouter.get('/me', authenticate, (req, res) => {
  const claims = req.user;
  if (claims === undefined) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }
  const record = users.findById(claims.id);
  if (record === undefined) {
    // Token is valid but the account was deleted — treat as unauthenticated.
    res.status(401).json({ error: 'Account no longer exists.' });
    return;
  }
  res.json({ user: users.toSafeUser(record) });
});

// POST /api/auth/logout — authenticated. JWTs are stateless, so the client
// simply discards the token; this endpoint exists for API symmetry/clients
// that want an explicit server acknowledgement.
authRouter.post('/logout', authenticate, (_req, res) => {
  res.sendStatus(204);
});
