import { api, ApiError, TOKEN_KEY } from '../lib/api';
import type { SessionUser } from '../lib/types';

const USER_KEY = 'auth.user';

function restoreUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw === null ? null : (JSON.parse(raw) as SessionUser);
  } catch {
    return null;
  }
}

/**
 * Global authentication state (Svelte 5 runes).
 *
 * The token is kept in localStorage for demo simplicity. Note the tradeoff:
 * localStorage is readable by any script on the page (XSS risk). Production
 * systems typically use httpOnly, Secure, SameSite cookies instead — the
 * backend remains the real enforcement point either way.
 */
class AuthStore {
  token = $state<string | null>(localStorage.getItem(TOKEN_KEY));
  user = $state<SessionUser | null>(restoreUser());

  get isAuthenticated(): boolean {
    return this.token !== null && this.user !== null;
  }

  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  setSession(token: string, user: SessionUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.token = token;
    this.user = user;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.token = null;
    this.user = null;
  }

  /** Re-validate the stored token against /auth/me (e.g. after a reload). */
  async refresh(): Promise<void> {
    if (this.token === null) {
      return;
    }
    try {
      const data = await api<{ user: SessionUser }>('/auth/me');
      this.user = data.user;
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        // Token expired or revoked — clear the stale session.
        this.logout();
      }
    }
  }
}

export const auth = new AuthStore();
