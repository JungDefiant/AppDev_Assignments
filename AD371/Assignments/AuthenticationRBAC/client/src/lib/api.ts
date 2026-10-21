// Thin fetch wrapper with JWT auth headers and normalized error handling.

export const TOKEN_KEY = 'auth.token';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token !== null) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`/api${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data as { error?: string } | null)?.error ?? `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message);
  }

  return data as T;
}
