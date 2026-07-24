import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { Logo } from '../components/ui/Logo';
import { Field } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useAuth } from '../context/AuthProvider';
import styles from './SignInPage.module.css';

// ── Schemas ───────────────────────────────────────────────────────────────────

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

// ── Page ──────────────────────────────────────────────────────────────────────

export function SignInPage() {
  const { isAuthenticated, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register: regIn,
    handleSubmit: handleIn,
    formState: { errors: errIn },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const {
    register: regUp,
    handleSubmit: handleUp,
    formState: { errors: errUp },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  if (isAuthenticated) return <Navigate to={from} replace />;

  const switchMode = (next: 'signin' | 'signup') => {
    setMode(next);
    setApiError(null);
  };

  const onSignIn = async (values: SignInValues) => {
    setApiError(null);
    setLoading(true);
    try {
      await signIn(values.email, values.password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const onSignUp = async (values: SignUpValues) => {
    setApiError(null);
    setLoading(true);
    try {
      await signUp(values.name, values.email, values.password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.themeCorner}>
        <ThemeToggle />
      </div>

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <Logo />
        </div>

        {/* Mode tabs */}
        <div className={styles.tabs} role="tablist">
          <button
            id="tab-signin"
            role="tab"
            type="button"
            aria-selected={mode === 'signin'}
            className={clsx(styles.tab, mode === 'signin' && styles.tabActive)}
            onClick={() => switchMode('signin')}
          >
            Sign in
          </button>
          <button
            id="tab-signup"
            role="tab"
            type="button"
            aria-selected={mode === 'signup'}
            className={clsx(styles.tab, mode === 'signup' && styles.tabActive)}
            onClick={() => switchMode('signup')}
          >
            Create account
          </button>
        </div>

        <h1 className={styles.title}>
          {mode === 'signin' ? 'Welcome back' : 'Get started'}
        </h1>
        <p className={styles.subtitle}>
          {mode === 'signin'
            ? 'Sign in to your CISOGenie workspace.'
            : 'Create a free account to get started.'}
        </p>

        {/* Error banner */}
        {apiError && (
          <div className={styles.errorBanner} role="alert">
            {apiError}
          </div>
        )}

        {/* Sign-in form */}
        {mode === 'signin' && (
          <form id="form-signin" className={styles.form} onSubmit={handleIn(onSignIn)} noValidate>
            <Field label="Email" error={errIn.email?.message}>
              <div className={styles.inputWrap}>
                <Mail size={16} className={styles.inputIcon} />
                <input
                  id="signin-email"
                  type="email"
                  className={clsx(styles.input, errIn.email && styles.invalid)}
                  placeholder="you@company.com"
                  autoFocus
                  autoComplete="email"
                  {...regIn('email')}
                />
              </div>
            </Field>

            <Field label="Password" error={errIn.password?.message}>
              <div className={styles.inputWrap}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  id="signin-password"
                  type="password"
                  className={clsx(styles.input, errIn.password && styles.invalid)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...regIn('password')}
                />
              </div>
            </Field>

            <Button id="btn-signin" type="submit" disabled={loading}
              style={{ width: '100%', height: 44, marginTop: 4 }}>
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>
        )}

        {/* Sign-up form */}
        {mode === 'signup' && (
          <form id="form-signup" className={styles.form} onSubmit={handleUp(onSignUp)} noValidate>
            <Field label="Full name" error={errUp.name?.message}>
              <div className={styles.inputWrap}>
                <User size={16} className={styles.inputIcon} />
                <input
                  id="signup-name"
                  type="text"
                  className={clsx(styles.input, errUp.name && styles.invalid)}
                  placeholder="Jane Smith"
                  autoFocus
                  autoComplete="name"
                  {...regUp('name')}
                />
              </div>
            </Field>

            <Field label="Email" error={errUp.email?.message}>
              <div className={styles.inputWrap}>
                <Mail size={16} className={styles.inputIcon} />
                <input
                  id="signup-email"
                  type="email"
                  className={clsx(styles.input, errUp.email && styles.invalid)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  {...regUp('email')}
                />
              </div>
            </Field>

            <Field label="Password" error={errUp.password?.message}>
              <div className={styles.inputWrap}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  id="signup-password"
                  type="password"
                  className={clsx(styles.input, errUp.password && styles.invalid)}
                  placeholder="Min 6 characters"
                  autoComplete="new-password"
                  {...regUp('password')}
                />
              </div>
            </Field>

            <Field label="Confirm password" error={errUp.confirmPassword?.message}>
              <div className={styles.inputWrap}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  id="signup-confirm"
                  type="password"
                  className={clsx(styles.input, errUp.confirmPassword && styles.invalid)}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  {...regUp('confirmPassword')}
                />
              </div>
            </Field>

            <Button id="btn-signup" type="submit" disabled={loading}
              style={{ width: '100%', height: 44, marginTop: 4 }}>
              {loading ? 'Creating account…' : 'Create account'}
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
