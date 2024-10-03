import { Link } from 'react-router-dom';
import { Layout, Menu, Input } from 'antd';
import clsx from 'clsx';
import styles from './index.module.scss';
import SubHeader from '../SubHeader';

const { Header: AntHeader } = Layout;

function Header() {
  const onSearch = (value) => console.log(value);

  console.log('Header render');

  const menuItems = [
    { key: '1', label: <Link to="/">Home</Link> },
    { key: '2', label: <Link to="/about">About</Link> },
    { key: '3', label: <Link to="/contact">Contact</Link> },
  ];

  return (
    <>
      <AntHeader className={clsx(styles.header)}>
        <div className={styles.logo}>Logo</div>
        <div>
          <Input.Search placeholder="Search" onSearch={onSearch} loading={false} />
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} className={styles.menu} items={menuItems} />
      </AntHeader>
      <SubHeader />
    </>
  );
}

export default Header;
