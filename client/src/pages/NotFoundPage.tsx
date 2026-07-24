import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <div className={styles.wrap}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.text}>The page you're looking for doesn't exist or has moved.</p>
      <Link to="/">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}
