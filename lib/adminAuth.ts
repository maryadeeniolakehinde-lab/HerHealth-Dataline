export interface AdminSession {
  email: string;
  token: string;
  timestamp: number;
}

const ADMIN_SESSION_KEY = 'herhealth_admin_session';

export const getAdminSession = (): AdminSession | null => {
  if (typeof window === 'undefined') return null;

  const session = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) return null;

  try {
    return JSON.parse(session) as AdminSession;
  } catch (error) {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  }
};

export const setAdminSession = (email: string, token: string): void => {
  if (typeof window === 'undefined') return;

  localStorage.setItem(
    ADMIN_SESSION_KEY,
    JSON.stringify({ email, token, timestamp: Date.now() })
  );
};

export const clearAdminSession = (): void => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const isAdminAuthenticated = (): boolean => {
  return getAdminSession() !== null;
};
