import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, Users } from 'lucide-react';
import clsx from 'clsx';
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
  return (
    <>
      {open && <div className={styles.backdrop} onClick={onClose} aria-hidden />}

      <aside className={clsx(styles.sidebar, open && styles.open)}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            <ShieldCheck size={20} />
          </span>
          <span>
            <span className={styles.brandName}>Directory</span>
            <span className={styles.brandSub}>People Management</span>
          </span>
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
            <span className={styles.userAvatar}>NR</span>
            <span className={styles.userInfo}>
              <span className={styles.userName}>Namratha R</span>
              <span className={styles.userRole}>Administrator</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
