import PropTypes from 'prop-types';
import { ConfigProvider } from 'antd';
import './index.scss';

function GlobalStyles({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: 'rgb(212, 22, 60)',
          borderRadius: 2,
          // Alias Token
          fontFamily: "'Montserrat', sans-serif",
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
