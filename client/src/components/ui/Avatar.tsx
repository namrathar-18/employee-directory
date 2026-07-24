import { departmentColor, getInitials, withAlpha } from '../../lib/format';
import styles from './Avatar.module.css';

interface AvatarProps {
  firstName: string;
  lastName: string;
  department?: string;
  size?: number;
  src?: string;
}

export function Avatar({ firstName, lastName, department, size = 40, src }: AvatarProps) {
  const color = departmentColor(department ?? '');

  if (src) {
    return (
      <img
        className={styles.avatar}
        src={src}
        alt={`${firstName} ${lastName}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        backgroundColor: withAlpha(color, 0.16),
        color,
        fontSize: Math.round(size * 0.38),
      }}
      aria-hidden
    >
      {getInitials(firstName, lastName)}
    </span>
  );
}
