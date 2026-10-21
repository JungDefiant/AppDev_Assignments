import { randomUUID } from 'node:crypto';

export type Role = 'user' | 'admin';

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
}

/** User shape that is safe to send to clients — NEVER includes the password hash. */
export interface SafeUser {
  id: string;
  username: string;
  email: string;
  role: Role;
  createdAt: string;
}

// Lightweight in-memory store (username OR email -> record, id -> record).
// A real deployment would use a database; the access-control logic is identical.
const byLogin = new Map<string, UserRecord>();
const byId = new Map<string, UserRecord>();

export function toSafeUser(user: UserRecord): SafeUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

export function userCount(): number {
  return byId.size;
}

export function findByUsername(username: string): UserRecord | undefined {
  return byLogin.get(username.toLowerCase());
}

export function findByEmail(email: string): UserRecord | undefined {
  return byLogin.get(email.toLowerCase());
}

export function findById(id: string): UserRecord | undefined {
  return byId.get(id);
}

export function usernameOrEmailTaken(username: string, email: string): boolean {
  return findByUsername(username) !== undefined || findByEmail(email) !== undefined;
}

export function createUser(input: {
  username: string;
  email: string;
  passwordHash: string;
  role: Role;
}): UserRecord {
  const user: UserRecord = {
    id: randomUUID(),
    username: input.username,
    email: input.email,
    passwordHash: input.passwordHash,
    role: input.role,
    createdAt: new Date(),
  };
  byId.set(user.id, user);
  byLogin.set(user.username.toLowerCase(), user);
  byLogin.set(user.email.toLowerCase(), user);
  return user;
}

export function listUsers(): SafeUser[] {
  return [...byId.values()]
    .map(toSafeUser)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function deleteUser(id: string): boolean {
  const user = byId.get(id);
  if (user === undefined) {
    return false;
  }
  byId.delete(id);
  byLogin.delete(user.username.toLowerCase());
  byLogin.delete(user.email.toLowerCase());
  return true;
}
