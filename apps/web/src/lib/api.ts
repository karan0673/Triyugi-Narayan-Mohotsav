const BASE = '/api/v1';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

/** Thin fetch wrapper: same-origin, cookies included, errors in the API's standard shape. */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    // TODO: add the X-CSRF-Token header for state-changing requests.
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const err = body?.error;
    throw new ApiError(res.status, err?.code ?? 'ERROR', err?.message ?? res.statusText, err?.details);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}
