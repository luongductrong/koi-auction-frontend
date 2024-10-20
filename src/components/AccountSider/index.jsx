import React, { useState, useEffect } from 'react';
import { Layout, Menu, ConfigProvider, Button } from 'antd';
import {
  UserOutlined,
  CreditCardOutlined,
  ScheduleOutlined,
  ShoppingCartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import styles from './index.module.scss';

const { Sider: AntSider } = Layout;

function AccountSider() {
  console.log('Account Sider render');

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
            <Menu.Item key="/account-center/wallet-manage" icon={<CreditCardOutlined />} className={styles.menuItem}>
              <Link to="wallet-manage">Quản lý ví</Link>
            </Menu.Item>
            <Menu.Item key="/account-center/schedule-manage" icon={<ScheduleOutlined />} className={styles.menuItem}>
              <Link to="schedule-manage">Quản lý lịch</Link>
            </Menu.Item>
            <Menu.Item key="/account-center/order-manage" icon={<ShoppingCartOutlined />} className={styles.menuItem}>
              <Link to="order-manage">Quản lý đơn hàng</Link>
            </Menu.Item>
            <Menu.Item key="/account-center/auction-manage" icon={<UserOutlined />} className={styles.menuItem}>
              <Link to="auction-manage">Quản lý cuộc đấu giá</Link>
            </Menu.Item>
            <Menu.Item key="/account-center/koi-manage" icon={<UserOutlined />} className={styles.menuItem}>
              <Link to="koi-manage">Quản lý cá Koi</Link>
            </Menu.Item>
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
