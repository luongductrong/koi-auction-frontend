import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, ConfigProvider } from 'antd';
import { UserOutlined, CreditCardOutlined, ScheduleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Sider: AntSider } = Layout;

const btnStyles = { minWidth: '80%', display: 'inline-flex', justifyContent: 'flex-start' };

function AccountSider() {
  console.log('Account Sider render');

  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    console.log(location.pathname);
    if (location.pathname === '/account-center') {
      setCurrentPath('/account-center/profile');
      return;
    }
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const getButtonVariant = (link) => {
    return currentPath.includes(link) ? 'filled' : 'outlined';
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 5,
        },
        components: {
          Layout: {
            siderBg: 'transparent',
          },
        },
      }}
    >
      <AntSider width={'28%'}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Link to="profile">
            <Button variant={getButtonVariant('profile')} color="primary" size="large" style={btnStyles}>
              <UserOutlined />
              <span>Thông tin cá nhân</span>
            </Button>
          </Link>
          <Link to="wallet-manage">
            <Button variant={getButtonVariant('wallet-manage')} color="primary" size="large" style={btnStyles}>
              <CreditCardOutlined />
              <span>Quản lý ví</span>
            </Button>
          </Link>
          <Link to="schedule-manage">
            <Button variant={getButtonVariant('schedule-manage')} color="primary" size="large" style={btnStyles}>
              <ScheduleOutlined />
              <span>Quản lý lịch</span>
            </Button>
          </Link>
          <Link to="order-manage">
            <Button variant={getButtonVariant('order-manage')} color="primary" size="large" style={btnStyles}>
              <ShoppingCartOutlined />
              <span>Quản lý đơn hàng</span>
            </Button>
          </Link>
          <Link to="auction-manage">
            <Button variant={getButtonVariant('auction-manage')} color="primary" size="large" style={btnStyles}>
              <span>Quản lý cuộc đấu giá</span>
            </Button>
          </Link>
          <Link to="koi-manage">
            <Button variant={getButtonVariant('koi-manage')} color="primary" size="large" style={btnStyles}>
              <span>Quản lý cá Koi</span>
            </Button>
          </Link>
        </Space>
      </AntSider>
    </ConfigProvider>
  );
}

export default AccountSider;
