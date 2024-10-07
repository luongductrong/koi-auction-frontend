import { Layout } from 'antd';
import styles from './index.module.scss';
import Breadcrumb from '../Breadcrumb';

function Content({ children }) {
  const { Content: AntContent } = Layout;
  return (
    <AntContent className={styles.content}>
      <div className={styles.container}>
        <Breadcrumb />
        {children}
      </div>
    </AntContent>
  );
}

export default Content;
