import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Input, Button, ConfigProvider, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNetworkStatus } from 'hook';
import styles from './index.module.scss';
import Logo from '../Logo';
import Menu from '../Menu';

const { Header: AntHeader } = Layout;

function Header() {
  const user = useSelector((state) => state.user.user);
  const { t } = useTranslation();
  const fullUrl = useLocation().pathname + useLocation().search + useLocation().hash;
  const isOnline = useNetworkStatus();

  const isBreeder = user && user?.role?.toLowerCase() === 'breeder';

  const onSearch = (value) => console.log(value);

  const items = [
    {
      key: '1',
      label: (
        <Link>
          <UserOutlined /> {t('component.header.account_center')}
        </Link>
      ),
      children: [
        {
          key: '1-1',
          label: <Link to="/account-center/profile">{t('component.header.personal_info')}</Link>,
        },
        {
          key: '1-2',
          label: <Link to="/account-center/wallet">{t('component.header.wallet_management')}</Link>,
        },
        {
          key: '1-3',
          label: <Link to="/account-center/schedule">{t('component.header.schedule_management')}</Link>,
        },
        {
          key: '1-4',
          label: <Link to="/account-center/order">{t('component.header.order_management')}</Link>,
        },
        ...(isBreeder
          ? [
              {
                key: '1-5',
                label: <Link to="/account-center/auction">{t('component.header.auction_management')}</Link>,
              },
              {
                key: '1-6',
                label: <Link to="/account-center/koi">{t('component.header.koi_management')}</Link>,
              },
            ]
          : []),
      ],
    },
    {
      key: '2',
      label: (
        <Link to="login">
          <LogoutOutlined /> {t('component.header.logout')}
        </Link>
      ),
    },
  ];

  console.log('Header render');

  return (
    <ConfigProvider>
      <AntHeader className={styles.header}>
        {isOnline || (
          <div className={styles.statusHeader}>
            <p className={styles.offline}>{t('component.header.offline_status')}</p>
          </div>
        )}
        <div className={styles.container}>
          <div className={styles.topHeader}>
            <Logo />
            <Input.Search
              className={styles.searchBar}
              placeholder={t('component.header.search_placeholder')}
              onSearch={onSearch}
              loading={false}
            />
            <div className={styles.btnGroup}>
              {user ? (
                <Dropdown menu={{ items }} trigger={['hover']} arrow>
                  <Button type="primary">
                    {user?.fullname && user.fullname !== '' ? user.fullname : t('component.header.new_user')}
                  </Button>
                </Dropdown>
              ) : (
                <>
                  <Link to={`/login?redirect=${fullUrl}`} className={styles.btn}>
                    <Button type="primary" ghost>
                      {t('component.header.login')}
                    </Button>
                  </Link>
                  <Link to="/register" className={styles.btn}>
                    <Button
                      type="primary"
                      style={{
                        marginLeft: '10px',
                      }}
                    >
                      {t('component.header.register')}
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
