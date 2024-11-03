import { Menu as AntMenu, ConfigProvider } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';

function Menu() {
  const location = useLocation();
  const { t } = useTranslation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      key: 'sub1',
      label: (
        <p className={styles.subMenuTitle}>
          <UnorderedListOutlined />
          {t('component.menu.auctions')}
        </p>
      ),
      className: styles.subMenu,
      style: { backgroundColor: 'var(--primary-color)' },
      children: [
        { key: 'schedule', label: <Link to="/auction?status=scheduled">{t('component.menu.scheduled_auction')}</Link> },
        { key: 'current', label: <Link to="/auction?status=ongoing">{t('component.menu.ongoing_auction')}</Link> },
        { key: 'past', label: <Link to="/auction?status=closed">{t('component.menu.closed_auction')}</Link> },
      ],
      type: 'submenu',
    },
    { key: '/', label: <Link to="/">{t('component.menu.home')}</Link> },
    { key: '/about', label: <Link to="/about">{t('component.menu.about')}</Link> },
    { key: '/contact', label: <Link to="/contact">{t('component.menu.contact')}</Link> },
    { key: '/blog', label: <Link to="/blog">{t('component.menu.blog')}</Link> },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: '14px',
        },
        components: {
          Menu: {},
        },
      }}
    >
      <AntMenu
        mode="horizontal"
        className={styles.menu}
        items={menuItems}
        theme="light"
        defaultSelectedKeys={currentPath}
      />
    </ConfigProvider>
  );
}

export default Menu;
