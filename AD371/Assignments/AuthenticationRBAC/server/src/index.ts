import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import { config } from './config.ts';
import { authRouter } from './routes/auth.ts';
import { publicRouter } from './routes/public.ts';
import { userRouter } from './routes/user.ts';
import { adminRouter } from './routes/admin.ts';

const app = express();

// --- Baseline hardening -----------------------------------------------------
app.disable('x-powered-by');
app.use(cors()); // permissive for the local demo; lock down origins in production
app.use(express.json({ limit: '16kb' })); // small body limit to blunt flood attacks

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cache-Control', 'no-store'); // never cache authenticated responses
  next();
});

// --- Routes by access tier --------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRouter); // public: register / login (+ me, logout)
app.use('/api/public', publicRouter); // public tier
app.use('/api/user', userRouter); // protected tier (any authenticated user)
app.use('/api/admin', adminRouter); // restricted tier (admin only)

// --- 404 + centralized JSON error handler ------------------------------------
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found.' });
});

// Express 5 forwards rejected promises from async handlers here too.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[error]', err);
  if (res.headersSent) {
    return;
  }
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(config.port, () => {
  console.log(`[server] Auth/RBAC API listening on http://localhost:${config.port}`);
});
