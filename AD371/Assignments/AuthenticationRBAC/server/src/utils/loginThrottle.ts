// Very small in-memory brute-force throttle for the login endpoint.
// Tracks failed attempts per (normalized) username and temporarily locks out.

interface FailureRecord {
  count: number;
  lockedUntil: number; // epoch ms; 0 = not currently locked
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

const failures = new Map<string, FailureRecord>();

export const loginThrottle = {
  isLocked(username: string): boolean {
    const record = failures.get(username);
    if (record === undefined) {
      return false;
    }
    if (record.lockedUntil > Date.now()) {
      return true;
    }
    if (record.lockedUntil > 0) {
      // Lock expired — reset the counter.
      failures.delete(username);
    }
    return false;
  },

  recordFailure(username: string): void {
    const record = failures.get(username) ?? { count: 0, lockedUntil: 0 };
    record.count += 1;
    if (record.count >= MAX_ATTEMPTS) {
      record.lockedUntil = Date.now() + LOCKOUT_MS;
      record.count = 0;
    }
    failures.set(username, record);
  },

  reset(username: string): void {
    failures.delete(username);
  },
};
