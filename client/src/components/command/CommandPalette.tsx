import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CornerDownLeft, LayoutDashboard, Search, UserPlus, Users } from 'lucide-react';
import clsx from 'clsx';
import { Avatar } from '../ui/Avatar';
import { useDebounce } from '../../hooks/useDebounce';
import { api } from '../../lib/api';
import type { Employee, PaginatedEmployees } from '../../types/employee';
import styles from './CommandPalette.module.css';

interface CommandResult {
  key: string;
  label: string;
  sub?: string;
  icon: React.ReactNode;
  run: () => void;
}

export function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounced = useDebounce(query.trim(), 200);

  // Open with Cmd/Ctrl+K, close with Escape, and respond to the topbar trigger.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((prev) => !prev);
      } else if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    const onTrigger = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('cadre:command', onTrigger);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('cadre:command', onTrigger);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      document.body.style.overflow = 'hidden';
      const id = window.setTimeout(() => inputRef.current?.focus(), 20);
      return () => window.clearTimeout(id);
    }
    document.body.style.overflow = '';
    return undefined;
  }, [open]);

  const { data: employees } = useQuery({
    queryKey: ['command', debounced],
    queryFn: async () => {
      const { data } = await api.get<PaginatedEmployees>('/employees', {
        params: { q: debounced, limit: 6 },
      });
      return data.data;
    },
    enabled: open && debounced.length > 0,
  });

  const results = useMemo<CommandResult[]>(() => {
    const q = debounced.toLowerCase();

    const navActions: CommandResult[] = [
      {
        key: 'nav-dashboard',
        label: 'Go to Dashboard',
        icon: <LayoutDashboard size={17} />,
        run: () => navigate('/'),
      },
      {
        key: 'nav-directory',
        label: 'Go to Directory',
        icon: <Users size={17} />,
        run: () => navigate('/employees'),
      },
      {
        key: 'action-add',
        label: 'Add employee',
        icon: <UserPlus size={17} />,
        run: () => navigate('/employees?new=1'),
      },
    ].filter((item) => !q || item.label.toLowerCase().includes(q));

    const people: CommandResult[] = (employees ?? []).map((employee: Employee) => ({
      key: `emp-${employee.id}`,
      label: employee.fullName,
      sub: `${employee.jobTitle} · ${employee.department}`,
      icon: (
        <Avatar
          firstName={employee.firstName}
          lastName={employee.lastName}
          department={employee.department}
          size={26}
        />
      ),
      run: () => navigate(`/employees/${employee.id}`),
    }));

    return [...navActions, ...people];
  }, [debounced, employees, navigate]);

  useEffect(() => {
    setActiveIndex(0);
  }, [debounced, employees]);

  if (!open) return null;

  const activate = (index: number) => {
    const result = results[index];
    if (result) {
      result.run();
      setOpen(false);
    }
  };

  const onInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      activate(activeIndex);
    }
  };

  return createPortal(
    <div className={styles.overlay} onMouseDown={() => setOpen(false)}>
      <div className={styles.palette} onMouseDown={(event) => event.stopPropagation()}>
        <div className={styles.searchRow}>
          <Search size={18} className={styles.searchIcon} />
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Search people or jump to a page…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
          />
          <kbd className={styles.esc}>Esc</kbd>
        </div>

        <div className={styles.results}>
          {results.length === 0 ? (
            <p className={styles.empty}>
              {debounced ? `No results for “${debounced}”` : 'Start typing to search…'}
            </p>
          ) : (
            results.map((result, index) => (
              <button
                key={result.key}
                type="button"
                className={clsx(styles.item, index === activeIndex && styles.active)}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => activate(index)}
              >
                <span className={styles.itemIcon}>{result.icon}</span>
                <span className={styles.itemText}>
                  <span className={styles.itemLabel}>{result.label}</span>
                  {result.sub && <span className={styles.itemSub}>{result.sub}</span>}
                </span>
                {index === activeIndex && <CornerDownLeft size={15} className={styles.enter} />}
              </button>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> to navigate
          </span>
          <span>
            <kbd>↵</kbd> to open
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
