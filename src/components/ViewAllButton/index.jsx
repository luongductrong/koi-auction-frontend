import { Link } from 'react-router-dom';
import { Button } from 'antd';
import styles from './index.module.scss';

function ViewAllButton() {
  return (
    <div className={styles.container}>
      <Link to="/auction">
        <Button type="primary" ghost className={styles.button}>
          Xem tất cả cuộc đấu giá
        </Button>
      </Link>
    </div>
  );
}

export default ViewAllButton;
