import type { CSSProperties } from 'react';
import clsx from 'clsx';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  style?: CSSProperties;
}

export function Skeleton({ className, width, height, radius, style }: SkeletonProps) {
  return (
    <span
      className={clsx(styles.skeleton, className)}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden
    />
  );
}
