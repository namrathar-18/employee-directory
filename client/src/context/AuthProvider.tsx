import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface AuthUser {
  email: string;
  name: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  signIn: (email: string) => void;
  signOut: () => void;
}

const STORAGE_KEY = 'cadre.auth';
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? '';
  const words = local.split(/[._-]+/).filter(Boolean);
  if (words.length === 0) return 'there';
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function readStored(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStored);

  const signIn = useCallback((email: string) => {
    const next: AuthUser = { email, name: nameFromEmail(email) };
    setUser(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — ignore */
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated: Boolean(user), user, signIn, signOut }),
    [user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
