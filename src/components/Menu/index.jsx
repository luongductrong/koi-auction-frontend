import { Menu as AntMenu, ConfigProvider } from 'antd';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';
import { UnorderedListOutlined } from '@ant-design/icons';

function Menu() {
  const menuItems = [
    {
      key: 'sub1',
      label: (
        <p className={styles.subMenuTitle}>
          <UnorderedListOutlined />
          {` Cuộc đấu giá`}
        </p>
      ),
      className: styles.subMenu,
      style: { backgroundColor: '#D4163C' },
      children: [
        { key: 'schedule', label: <Link to="/auction?status=scheduled">Cuộc đấu giá sắp diễn ra</Link> },
        { key: 'current', label: <Link to="/auction?status=ongoing">Cuộc đấu giá đang diễn ra</Link> },
        { key: 'past', label: <Link to="/auction?status=closed">Cuộc đấu giá đã kết thúc</Link> },
      ],
      type: 'submenu',
    },
    { key: 'home', label: <Link to="/">Trang chủ</Link> },
    { key: 'about', label: <Link to="/about">Về chúng tôi</Link> },
    { key: 'contact', label: <Link to="/contact">Liên hệ</Link> },
    { key: 'blog', label: <Link to="/blog">Blog</Link> },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {},
        },
      }}
    >
      <AntMenu mode="horizontal" className={styles.menu} items={menuItems} theme="light" defaultSelectedKeys="home" />
    </ConfigProvider>
  );
}

export default Menu;
