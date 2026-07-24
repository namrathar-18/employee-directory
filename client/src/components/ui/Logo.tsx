import clsx from 'clsx';
import styles from './Logo.module.css';

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" role="img" aria-hidden>
      <rect width="32" height="32" rx="8.5" fill="#0f766e" />
      <path
        d="M21.6 11.4 A 7.3 7.3 0 1 0 21.6 20.6"
        stroke="#ffffff"
        strokeWidth="3.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface LogoProps {
  size?: number;
  subtitle?: string;
  tone?: 'default' | 'light';
}

export function Logo({ size = 38, subtitle = 'People Directory', tone = 'default' }: LogoProps) {
  return (
    <div className={styles.logo}>
      <LogoMark size={size} />
      <span className={clsx(styles.text, tone === 'light' && styles.light)}>
        <span className={styles.name}>Cadre</span>
        {subtitle && <span className={styles.sub}>{subtitle}</span>}
      </span>
    </div>
  );
}
