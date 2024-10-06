import { Menu as AntMenu } from 'antd';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';

function Menu() {
  const menuItems = [
    { key: '1', label: <Link to="/">Home</Link> },
    { key: '2', label: <Link to="/about">About</Link> },
    { key: '3', label: <Link to="/contact">Contact</Link> },
  ];

  return <AntMenu mode="horizontal" className={styles.menu} items={menuItems} />;
}

export default Menu;
