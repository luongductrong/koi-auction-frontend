import React, { useState, useEffect } from 'react';
import { Layout, Menu, ConfigProvider } from 'antd';
import { UserOutlined, CreditCardOutlined, ScheduleOutlined } from '@ant-design/icons';
import { ShoppingCartOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './index.module.scss';

const { Sider: AntSider } = Layout;

function AccountSider() {
  console.log('Account Sider render');

  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    console.log(location.pathname);
    if (location.pathname === '/account-center') {
      setCurrentPath('/account-center/profile');
      return;
    }
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: '5px',
        },
      }}
    >
      <AntSider
        width={'240'}
        theme="light"
        collapsible
        collapsed={collapsed}
        trigger={null}
        collapsedWidth={100}
        className={styles.sider}
      >
        <ConfigProvider
          theme={{
            token: {
              colorText: 'rgb(212, 22, 60)',
              fontSize: 16,
            },
          }}
        >
          <Menu mode="vertical" selectedKeys={[currentPath]} className={styles.menu}>
            <Menu.Item key="/account-center/profile" icon={<UserOutlined />} className={styles.menuItem}>
              <Link to="profile">Thông tin cá nhân</Link>
            </Menu.Item>
            <Menu.Item key="/account-center/wallet" icon={<CreditCardOutlined />} className={styles.menuItem}>
              <Link to="wallet">Quản lý ví</Link>
            </Menu.Item>
            {/* <Menu.Item key="/account-center/schedule" icon={<ScheduleOutlined />} className={styles.menuItem}>
              <Link to="schedule">Quản lý lịch</Link>
            </Menu.Item> */}
            {/* <Menu.Item key="/account-center/order" icon={<ShoppingCartOutlined />} className={styles.menuItem}>
              <Link to="order">Quản lý đơn hàng</Link>
            </Menu.Item> */}
            {user && user?.role?.toLowerCase() === 'breeder' && (
              <>
                <Menu.Item key="/account-center/auction" icon={<UserOutlined />} className={styles.menuItem}>
                  <Link to="auction">Quản lý cuộc đấu giá</Link>
                </Menu.Item>
                <Menu.Item key="/account-center/koi" icon={<UserOutlined />} className={styles.menuItem}>
                  <Link to="koi">Quản lý cá Koi</Link>
                </Menu.Item>
              </>
            )}
            <Menu.Item icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} className={`${styles.trigger}`}>
              <Link to="#" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? 'Mở rộng' : ''}
              </Link>
            </Menu.Item>
          </Menu>
        </ConfigProvider>
      </AntSider>
    </ConfigProvider>
  );
}

export default AccountSider;
