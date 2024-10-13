import React from 'react';
import { Breadcrumb as AntBreadcrumb, ConfigProvider } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const breadcrumbNameMap = {
  '/login': 'Đăng nhập',
  '/register': 'Đăng ký',
  '/forgot-password': 'Quên mật khẩu',
  '/access-denied': '403',
  '/auction': 'Các cuộc đấu giá',
  '/account-center': 'Trung tâm tài khoản',
  '/account-center/profile': 'Thông tin cá nhân',
  '/account-center/wallet-manage': 'Quản lý ví',
  '/account-center/schedule-manage': 'Quản lý lịch',
  '/account-center/order-manage': 'Quản lý đơn hàng',
  '/account-center/auction-manage': 'Quản lý cuộc đấu giá',
  '/account-center/koi-manage': 'Quản lý cá Koi',
};

function Breadcrumb() {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return {
      key: url,
      title: <Link to={url}>{breadcrumbNameMap[url] || '404'}</Link>,
    };
  });

  const items = [
    {
      key: 'home',
      title: <Link to="/">Trang chủ</Link>,
    },
    ...breadcrumbItems,
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Breadcrumb: {
            linkColor: 'rgba(0, 0, 0, 0.45)',
          },
        },
      }}
    >
      <AntBreadcrumb items={items} separator="/" style={{ margin: '16px 0' }} />
    </ConfigProvider>
  );
}

export default Breadcrumb;
