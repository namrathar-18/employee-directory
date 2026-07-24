import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const API = import.meta.env.VITE_API_URL ?? '';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

// ── Storage helpers ───────────────────────────────────────────────────────────

const STORAGE_USER = 'ciso.auth.user';
const STORAGE_TOKEN = 'ciso.auth.token';

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_TOKEN);
  } catch {
    return null;
  }
}

function persist(user: AuthUser, token: string) {
  try {
    localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_TOKEN, token);
  } catch {
    /* storage unavailable */
  }
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem(STORAGE_TOKEN);
  } catch {
    /* ignore */
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const [token, setToken] = useState<string | null>(readStoredToken);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = (await res.json()) as { token?: string; user?: AuthUser; error?: string };

    if (!res.ok) {
      throw new Error(data.error ?? 'Sign in failed');
    }

    const { token: tok, user: usr } = data;
    if (!tok || !usr) throw new Error('Invalid response from server');

    setUser(usr);
    setToken(tok);
    persist(usr, tok);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = (await res.json()) as { token?: string; user?: AuthUser; error?: string };

    if (!res.ok) {
      throw new Error(data.error ?? 'Sign up failed');
    }

    const { token: tok, user: usr } = data;
    if (!tok || !usr) throw new Error('Invalid response from server');

    setUser(usr);
    setToken(tok);
    persist(usr, tok);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    clearStorage();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated: Boolean(user), user, token, signIn, signUp, signOut }),
    [user, token, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
