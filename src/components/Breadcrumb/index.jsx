import React from 'react';
import { Breadcrumb as AntBreadcrumb, ConfigProvider } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Breadcrumb() {
  const location = useLocation();
  const { t } = useTranslation();

  const breadcrumbNameMap = {
    '/login': t('component.breadcrumb.login'),
    '/register': t('component.breadcrumb.register'),
    '/forgot-password': t('component.breadcrumb.forgot_password'),
    '/access-denied': t('component.breadcrumb.access_denied'),
    '/auction': t('component.breadcrumb.auction'),
    '/auction/detail': t('component.breadcrumb.auction_detail'),
    '/auction/bid': t('component.breadcrumb.auction_bid'),
    '/account-center': t('component.breadcrumb.account_center'),
    '/account-center/profile': t('component.breadcrumb.profile'),
    '/account-center/wallet': t('component.breadcrumb.wallet'),
    '/account-center/schedule': t('component.breadcrumb.schedule'),
    '/account-center/order': t('component.breadcrumb.order'),
    '/account-center/auction': t('component.breadcrumb.auction_management'),
    '/account-center/koi': t('component.breadcrumb.koi_management'),
    '/auction/order': t('component.breadcrumb.auction_order'),
    '/about': t('component.breadcrumb.about'),
    '/contact': t('component.breadcrumb.contact'),
  };

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
      title: <Link to="/">{t('component.breadcrumb.home')}</Link>,
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
