import PropTypes from 'prop-types';
import { ConfigProvider } from 'antd';
import viVN from 'antd/es/locale/vi_VN';
import './index.scss';

function GlobalStyles({ children }) {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          // Seed Token
          colorPrimary: 'rgb(212, 22, 60)',
          borderRadius: 2,
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
