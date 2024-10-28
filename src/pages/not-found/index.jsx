import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button, ConfigProvider } from 'antd';
import styles from './index.module.scss';

function NotFound() {
  console.log('Not Found render');
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            borderRadius: 20,
          },
        },
      }}
    >
      <div className={styles.container}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.text}>Nội dung truy cập không tồn tại</p>
        <Link to="/">
          <Button type="primary">Về Trang chủ</Button>
        </Link>
      </div>
    </ConfigProvider>
  );
}

export default memo(NotFound);
