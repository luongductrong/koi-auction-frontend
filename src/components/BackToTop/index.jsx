import React, { useState, useEffect } from 'react';
import { FloatButton } from 'antd';
import { UpOutlined } from '@ant-design/icons';

const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    visible && (
      <FloatButton
        type="primary"
        shape="circle"
        icon={<UpOutlined />}
        size="large"
        onClick={scrollToTop}
        style={{ bottom: 30, right: 30 }}
      />
    )
  );
};

export default BackToTopButton;
