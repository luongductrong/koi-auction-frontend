import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ConfigProvider, theme } from 'antd';
import viVN from 'antd/es/locale/vi_VN';
import enUS from 'antd/es/locale/en_US';
import jaJP from 'antd/es/locale/ja_JP';
import zhCN from 'antd/es/locale/zh_CN';
import thTH from 'antd/es/locale/th_TH';
import './index.scss';

function GlobalStyles({ children }) {
  const [locale, setLocale] = useState(enUS);

  useEffect(() => {
    const storedLocale = localStorage.getItem('i18nextLng') || 'en-US';
    setLocale(
      storedLocale === 'vi-VN' || storedLocale === 'vi'
        ? viVN
        : storedLocale === 'th-TH' || storedLocale === 'th'
        ? thTH
        : storedLocale === 'ja-JP' || storedLocale === 'ja'
        ? jaJP
        : storedLocale === 'zh-CN' || storedLocale === 'zh'
        ? zhCN
        : enUS,
    );
  }, []);

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          // Seed Token
          colorPrimary: 'rgb(180, 23, 18)',
          borderRadius: 4,
          // Alias Token
          fontFamily: "'Montserrat', sans-serif",
          // colorBgContainer: '#f6ffed',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

GlobalStyles.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GlobalStyles;
