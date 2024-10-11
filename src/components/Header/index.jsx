import { Link } from 'react-router-dom';
import { Layout, Input, Button, ConfigProvider, Dropdown, Menu as AntMenu } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../redux/userSlice';
import clsx from 'clsx';
import styles from './index.module.scss';
import SubHeader from '../SubHeader';
import Logo from '../Logo';
import Menu from '../Menu';

const { Header: AntHeader } = Layout;

function Header() {
  //-------------------------------------> Header component
  const [headerHeight, setHeaderHeight] = useState(0); // State to store Header height
  const dispatch = useDispatch();
  const headerRef = useRef(null);
  const user = useSelector((state) => state.user.user);

  const onSearch = (value) => console.log(value);

  useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.getBoundingClientRect().height;
      setHeaderHeight(height);
    }
  }, []);

  const handleLogout = () => {
    dispatch(clearUser());
  };

  const menu = (
    <AntMenu>
      <AntMenu.Item key="1">
        <Link to="/account-center">
          <UserOutlined /> Trung tâm tài khoản
        </Link>
      </AntMenu.Item>
      <AntMenu.Item key="2">
        <Link to="/" onClick={handleLogout}>
          <LogoutOutlined /> Đăng xuất
        </Link>
      </AntMenu.Item>
    </AntMenu>
  );

  console.log('Header render');

  return (
    <ConfigProvider>
      <AntHeader className={clsx(styles.header)} ref={headerRef}>
        <div className={styles.container}>
          <div className={styles.topHeader}>
            <Logo />
            <Input.Search className={styles.searchBar} placeholder="Tìm kiếm..." onSearch={onSearch} loading={false} />
            <div className={styles.btnGroup}>
              {user ? (
                <Dropdown overlay={menu} trigger={['hover']}>
                  <Button type="primary">{user.fullname}</Button>
                </Dropdown>
              ) : (
                <>
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
                </>
              )}
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
