import { Link } from 'react-router-dom';
import { Layout, Input, Button, ConfigProvider } from 'antd';
import clsx from 'clsx';
import { useRef, useEffect, useState } from 'react';
import styles from './index.module.scss';
import SubHeader from '../SubHeader';
import Logo from '../Logo';
import Menu from '../Menu';

const { Header: AntHeader } = Layout;

function Header() {
  const [headerHeight, setHeaderHeight] = useState(0); // State to store Header height
  const headerRef = useRef(null); // Ref to get Header element

  const onSearch = (value) => console.log(value);

  useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.getBoundingClientRect().height;
      setHeaderHeight(height);
    }
  }, []);

  console.log('Header render');

  return (
    <ConfigProvider>
      <AntHeader className={clsx(styles.header)} ref={headerRef}>
        <div className={styles.container}>
          <div className={styles.topHeader}>
            <Logo />
            <Input.Search className={styles.searchBar} placeholder="Tìm kiếm..." onSearch={onSearch} loading={false} />
            <div className={styles.btnGroup}>
              <Button type="primary" ghost>
                <Link to="/login">Đăng nhập</Link>
              </Button>
              <Button
                type="primary"
                style={{
                  marginLeft: '10px',
                }}
              >
                <Link to="/register">Đăng ký</Link>
              </Button>
            </div>
          </div>
          <Menu />
        </div>
      </AntHeader>
      <SubHeader height={headerHeight} />
    </ConfigProvider>
  );
}

export default Header;
