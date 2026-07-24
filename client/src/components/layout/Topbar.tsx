import { Menu } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import styles from './Topbar.module.css';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className={styles.topbar}>
      <button
        type="button"
        className={styles.menuBtn}
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>
      <span className={styles.brandMobile}>Directory</span>

      <div className={styles.spacer} />

      <ThemeToggle />
      <span className={styles.userAvatar} title="Namratha R" aria-hidden>
        NR
      </span>
    </header>
  );
}
