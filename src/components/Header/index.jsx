import { Layout, Menu, Input } from 'antd';
import clsx from 'clsx';
import styles from './index.module.scss';
import SubHeader from '../SubHeader';

const { Header: AntHeader } = Layout;

function Header() {
  const onSearch = (value) => console.log(value);

  return (
    <>
      <AntHeader className={clsx(styles.header)}>
        <div className={styles.logo}>Logo</div>
        <div>
          <Input.Search placeholder="Search" onSearch={onSearch} loading={false} />
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} className={styles.menu}>
          <Menu.Item key="1">Home</Menu.Item>
          <Menu.Item key="2">About</Menu.Item>
          <Menu.Item key="3">Contact</Menu.Item>
        </Menu>
      </AntHeader>
      <SubHeader />
    </>
  );
}

export default Header;
