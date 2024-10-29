import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import Breadcrumb from '../Breadcrumb';
import BackToTopButton from '../BackToTop';
import styles from './index.module.scss';

const { Content: AntContent } = Layout;

function Content({ children }) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AntContent className={styles.content}>
      <div className={styles.container}>
        <Breadcrumb />
        {children}
        <BackToTopButton />
      </div>
    </AntContent>
  );
}

export default Content;
