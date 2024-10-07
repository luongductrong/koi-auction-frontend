import { Layout } from 'antd';
import AntSider from '../../components/AccountSider';
import styles from './index.module.scss';

const { Content: AntContent } = Layout;

function AccountCenter() {
  return (
    <Layout>
      <AntSider />
      <AntContent className={styles.content}>
        <div className={styles.container}>
          <div className={styles.accountCenter}>Account Center</div>
        </div>
      </AntContent>
    </Layout>
  );
}

export default AccountCenter;
