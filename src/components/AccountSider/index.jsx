import { Layout, Button, Space, ConfigProvider } from 'antd';
import { UserOutlined, CreditCardOutlined, ScheduleOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Sider: AntSider } = Layout;

const btnStyles = { minWidth: '80%', display: 'inline-flex', justifyContent: 'flex-start' };

function AccountSider() {
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 5,
        },
        components: {
          Layout: {
            siderBg: 'transparent',
          },
        },
      }}
    >
      <AntSider width={'28%'}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Button variant="outlined" color="primary" size="large" style={btnStyles}>
            <UserOutlined />
            <span>Thông tin cá nhân</span>
          </Button>
          <Button variant="outlined" color="primary" size="large" style={btnStyles}>
            <CreditCardOutlined />
            <span>Quản lý ví</span>
          </Button>
          <Button variant="filled" color="primary" size="large" style={btnStyles}>
            <ScheduleOutlined />
            <span>Quản lý lịch</span>
          </Button>
          <Button variant="outlined" color="primary" size="large" style={btnStyles}>
            <ShoppingCartOutlined />
            <span>Quản lý đơn hàng</span>
          </Button>
          <Button variant="outlined" color="primary" size="large" style={btnStyles}>
            Quản lý cuộc đấu giá
          </Button>
          <Button variant="outlined" color="primary" size="large" style={btnStyles}>
            Quản lý cá Koi
          </Button>
        </Space>
      </AntSider>
    </ConfigProvider>
  );
}

export default AccountSider;
