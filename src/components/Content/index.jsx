import { Layout } from 'antd';
import styles from './index.module.scss';
import Breadcrumb from '../Breadcrumb';

const { Content: AntContent } = Layout;

function Content({ children }) {
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
