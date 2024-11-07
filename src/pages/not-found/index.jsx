import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button, ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';

function NotFound() {
  const { t } = useTranslation();
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
        <h1 className={styles.title}>{t('page.not_found.title')}</h1>
        <p className={styles.text}>{t('page.not_found.message')}</p>
        <Link to="/">
          <Button type="primary">{t('page.not_found.button_home')}</Button>
        </Link>
      </div>
    </ConfigProvider>
  );
}

export default memo(NotFound);
