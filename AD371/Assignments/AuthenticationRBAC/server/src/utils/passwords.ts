import bcrypt from 'bcryptjs';
import { config } from '../config.ts';

/** Hash a password with bcrypt (adaptive, salted, slow by design). */
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, config.bcryptRounds);
}

/** Constant-time-ish comparison of a candidate password against a stored hash. */
export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Security: when a login fails because the *user does not exist*, we still run a
// bcrypt comparison against a dummy hash so that response timing does not reveal
// whether the username exists (prevents user enumeration via timing analysis).
let dummyHash: string | undefined;

export function fakeVerify(password: string): Promise<boolean> {
  dummyHash ??= bcrypt.hashSync('timing-equalization-dummy', config.bcryptRounds);
  return bcrypt.compare(password, dummyHash);
}
