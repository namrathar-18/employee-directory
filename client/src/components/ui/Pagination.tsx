import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import styles from './Pagination.module.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

/** Builds a compact page list with ellipsis gaps, e.g. 1 … 4 5 6 … 20. */
function buildPages(current: number, total: number): (number | 'gap')[] {
  const pages: (number | 'gap')[] = [];
  for (let page = 1; page <= total; page += 1) {
    const nearCurrent = page >= current - 1 && page <= current + 1;
    if (page === 1 || page === total || nearCurrent) {
      pages.push(page);
    } else if (pages[pages.length - 1] !== 'gap') {
      pages.push('gap');
    }
  }
  return pages;
}

export function Pagination({ page, totalPages, total, limit, onPageChange }: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className={styles.pagination}>
      <span className={styles.info}>
        Showing <strong>{from}–{to}</strong> of <strong>{total}</strong>
      </span>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {buildPages(page, totalPages).map((item, index) =>
          item === 'gap' ? (
            <span key={`gap-${index}`} className={styles.gap}>
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={clsx(styles.page, item === page && styles.active)}
              onClick={() => onPageChange(item)}
              aria-current={item === page ? 'page' : undefined}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          className={styles.arrow}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
