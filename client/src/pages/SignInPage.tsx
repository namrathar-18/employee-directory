import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Search, ShieldCheck, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { Logo } from '../components/ui/Logo';
import { Field } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { DirectoryArt } from '../components/illustrations/DirectoryArt';
import { useAuth } from '../context/AuthProvider';
import styles from './SignInPage.module.css';

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type SignInValues = z.infer<typeof signInSchema>;

export function SignInPage() {
  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  if (isAuthenticated) return <Navigate to={from} replace />;

  const onSubmit = (values: SignInValues) => {
    signIn(values.email);
    navigate(from, { replace: true });
  };

  const fillDemo = () => {
    setValue('email', 'demo@cadre.app', { shouldValidate: true });
    setValue('password', 'cadre-demo', { shouldValidate: true });
  };

  return (
    <div className={styles.page}>
      <aside className={styles.brandPanel}>
        <div className={styles.brandTop}>
          <Logo subtitle="People Directory" tone="light" />
        </div>

        <div className={styles.art}>
          <DirectoryArt />
        </div>

        <div className={styles.brandCopy}>
          <h1 className={styles.headline}>Everyone on your team, in one place.</h1>
          <p className={styles.lead}>
            Search, filter and manage your people with a directory that stays out of your way.
          </p>
          <ul className={styles.points}>
            <li>
              <Search size={16} /> Instant search and filtering
            </li>
            <li>
              <ShieldCheck size={16} /> Role and department insights
            </li>
            <li>
              <Sparkles size={16} /> Fast, clean and fully responsive
            </li>
          </ul>
        </div>
      </aside>

      <main className={styles.formPanel}>
        <div className={styles.themeCorner}>
          <ThemeToggle />
        </div>

        <div className={styles.formInner}>
          <div className={styles.mobileLogo}>
            <Logo />
          </div>

          <h2 className={styles.title}>Welcome back</h2>
          <p className={styles.subtitle}>Sign in to your Cadre workspace.</p>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <Field label="Work email" error={errors.email?.message}>
              <div className={styles.inputWrap}>
                <Mail size={16} className={styles.inputIcon} />
                <input
                  type="email"
                  className={clsx(styles.input, errors.email && styles.invalid)}
                  placeholder="you@company.com"
                  autoFocus
                  {...register('email')}
                />
              </div>
            </Field>

            <Field label="Password" error={errors.password?.message}>
              <div className={styles.inputWrap}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  type="password"
                  className={clsx(styles.input, errors.password && styles.invalid)}
                  placeholder="••••••••"
                  {...register('password')}
                />
              </div>
            </Field>

            <Button type="submit" style={{ width: '100%', height: 46, marginTop: 4, fontSize: 15 }}>
              Sign in
              <ArrowRight size={16} />
            </Button>
          </form>

          <div className={styles.demo}>
            <span>Just exploring?</span>
            <button type="button" className={styles.demoBtn} onClick={fillDemo}>
              Use demo credentials
            </button>
          </div>
        </div>

        <p className={styles.footer}>This is a demo — any email and password will sign you in.</p>
      </main>
    </div>
  );
}
