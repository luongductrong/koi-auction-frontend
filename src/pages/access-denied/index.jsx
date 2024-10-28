import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button, ConfigProvider } from 'antd';
import styles from './index.module.scss';

function AccessDenied() {
  console.log('Access Denied render');
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
        <h1 className={styles.title}>403</h1>
        <p className={styles.text}>Bạn không có quyền truy cập vào nội dung này</p>
        <Link to="/">
          <Button type="primary">Về Trang chủ</Button>
        </Link>
      </div>
    </ConfigProvider>
  );
}

export default memo(AccessDenied);
