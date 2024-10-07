import { Layout } from 'antd';
import styles from './index.module.scss';

function Content({ children }) {
  const { Content: AntContent } = Layout;
  return (
    <AntContent className={styles.content}>
      <div className={styles.container}>{children}</div>
    </AntContent>
  );
}

export default Content;
