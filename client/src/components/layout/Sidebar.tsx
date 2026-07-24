import { NavLink } from 'react-router-dom';
import { LayoutDashboard, LogOut, Users } from 'lucide-react';
import clsx from 'clsx';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../context/AuthProvider';
import { initialsFromName } from '../../lib/format';
import styles from './Sidebar.module.css';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/employees', label: 'Directory', icon: Users, end: false },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, signOut } = useAuth();

  return (
    <>
      {open && <div className={styles.backdrop} onClick={onClose} aria-hidden />}

      <aside className={clsx(styles.sidebar, open && styles.open)}>
        <div className={styles.brand}>
          <Logo />
        </div>

        <nav className={styles.nav}>
          <span className={styles.navLabel}>Menu</span>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) => clsx(styles.navItem, isActive && styles.navItemActive)}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <div className={styles.userCard}>
            <span className={styles.userAvatar}>{initialsFromName(user?.name)}</span>
            <span className={styles.userInfo}>
              <span className={styles.userName}>{user?.name ?? 'Guest'}</span>
              <span className={styles.userEmail}>{user?.email ?? 'Signed in'}</span>
            </span>
            <button
              type="button"
              className={styles.signOut}
              onClick={signOut}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
