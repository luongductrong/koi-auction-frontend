import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Input, Button, ConfigProvider, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import styles from './index.module.scss';
import Logo from '../Logo';
import Menu from '../Menu';

const { Header: AntHeader } = Layout;

function Header() {
  const user = useSelector((state) => state.user.user);

  const onSearch = (value) => console.log(value);

  const items = [
    {
      key: '1',
      label: (
        <Link>
          <UserOutlined /> Trung tâm tài khoản
        </Link>
      ),
      children: [
        {
          key: '1-1',
          label: <Link to="/account-center/profile">Thông tin cá nhân</Link>,
        },
        {
          key: '1-2',
          label: <Link to="/account-center/wallet">Quản lý ví</Link>,
        },
        {
          key: '1-3',
          label: <Link to="/account-center/schedule">Quản lý lịch</Link>,
        },
        {
          key: '1-4',
          label: <Link to="/account-center/order">Quản lý đơn hàng</Link>,
        },
        {
          key: '1-5',
          label: <Link to="/account-center/auction">Quản lý cuộc đấu giá</Link>,
        },
        {
          key: '1-6',
          label: <Link to="/account-center/koi">Quản lý cá Koi</Link>,
        },
      ],
    },
    {
      key: '2',
      label: (
        <Link to="/login">
          <LogoutOutlined /> Đăng xuất
        </Link>
      ),
    },
  ];

  console.log('Header render');

  return (
    <ConfigProvider>
      <AntHeader className={styles.header}>
        <div className={styles.container}>
          <div className={styles.topHeader}>
            <Logo />
            <Input.Search className={styles.searchBar} placeholder="Tìm kiếm..." onSearch={onSearch} loading={false} />
            <div className={styles.btnGroup}>
              {user ? (
                <Dropdown menu={{ items }} trigger={['hover']} arrow>
                  <Button type="primary">{user.fullname}</Button>
                </Dropdown>
              ) : (
                <>
                  <Link to="/login" className={styles.btn}>
                    <Button type="primary" ghost>
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/register" className={styles.btn}>
                    <Button
                      type="primary"
                      style={{
                        marginLeft: '10px',
                      }}
                    >
                      Đăng ký
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <Menu />
        </div>
      </AntHeader>
      <div style={{ minHeight: '96px' }} className="_subHeader_1hamw_1"></div>
    </ConfigProvider>
  );
}

export default Header;
