import { Flex, Space, Typography, Avatar, ConfigProvider } from 'antd';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from './profile.module.scss';

const { Text, Title } = Typography;
const { Option } = Select;

function Profile() {
  console.log('Profile render');
  return (
    <div style={{ padding: '4%' }}>
      <ConfigProvider
        theme={{
          components: {
            Typography: {
              titleMarginBottom: '0',
            },
          },
        }}
      >
        <Flex vertical>
          <Flex>
            <Avatar size={100} icon={<UserOutlined />} />
            <Space direction="vertical" size={8} style={{ marginLeft: '16px' }}>
              <Title level={3}>Nguyễn Văn A</Title>
              <p className={styles.pText}>
                <CheckCircleOutlined />
                {` Đã xác thực thông tin`}
              </p>
              <Link to="change-password">Đổi mật khẩu</Link>
            </Space>
          </Flex>
          <div className={styles.infoContainer}>
            <h2 style={{ marginBottom: '2rem' }}>Thông tin cá nhân</h2>
            <Form
              layout="vertical"
              initialValues={{
                gender: 'Nam',
                fullname: 'Nguyễn Văn A',
                // dob: '01/01/1990',
              }}
              className={styles.form}
            >
              <Form.Item
                label="Họ và tên"
                name="fullname"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Giới tính" name="gender" className={styles.shortInput}>
                <Select>
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                  <Option value="Nữ">Khác</Option>
                </Select>
              </Form.Item>
              <Form.Item
                className={styles.shortInput}
                label="Ngày sinh"
                name="dob"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
              >
                <DatePicker format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item
                className={styles.shortInput}
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Tỉnh/Thành phố" name="province">
                <Select>
                  <Option value="Bình Định">Bình Định</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Quận/Huyện" name="district">
                <Select>
                  <Option value="Phù Cát">Phù Cát</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Xã/Phường" name="ward">
                <Select>
                  <Option value="Cát Lâm">Cát Lâm</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Cập Nhật
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Flex>
      </ConfigProvider>
    </div>
  );
}

export default Profile;
