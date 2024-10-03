import { Layout, Menu } from 'antd';
import clsx from 'clsx';
import styles from './index.module.scss';

const { Header: AntHeader } = Layout;

const Header = () => {
  return (
    <AntHeader className={clsx(styles.header)}>
      <div className={styles.logo}>Logo</div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">Home</Menu.Item>
        <Menu.Item key="2">About</Menu.Item>
        <Menu.Item key="3">Contact</Menu.Item>
      </Menu>
    </AntHeader>
  );
};

export default Header;
