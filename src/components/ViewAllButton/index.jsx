import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';

function ViewAllButton() {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <Link to="/auction">
        <Button type="primary" ghost className={styles.button}>
          {t('component.view_all_button.view_all')}
        </Button>
      </Link>
    </div>
  );
}

export default ViewAllButton;
