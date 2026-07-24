import { Menu, Search } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LogoMark } from '../ui/Logo';
import { useAuth } from '../../context/AuthProvider';
import { initialsFromName } from '../../lib/format';
import styles from './Topbar.module.css';

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();

  const openCommand = () => window.dispatchEvent(new Event('cadre:command'));

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
      <span className={styles.brandMobile}>
        <LogoMark size={26} />
        Cadre
      </span>

      <button type="button" className={styles.search} onClick={openCommand}>
        <Search size={16} />
        <span className={styles.searchText}>Search people…</span>
        <kbd className={styles.kbd}>{isMac ? '⌘' : 'Ctrl'} K</kbd>
      </button>

      <div className={styles.spacer} />

      <ThemeToggle />
      <span className={styles.userAvatar} title={user?.name ?? 'Account'}>
        {initialsFromName(user?.name)}
      </span>
    </header>
  );
}
