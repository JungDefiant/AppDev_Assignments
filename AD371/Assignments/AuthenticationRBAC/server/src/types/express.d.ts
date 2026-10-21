// Merges an optional `user` property into Express's Request type,
// populated by the `authenticate` middleware.
import type { AuthUser } from '../middleware/auth.ts';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
