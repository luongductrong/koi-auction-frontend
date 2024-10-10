import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Flex, Space, Typography, Avatar, ConfigProvider } from 'antd';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import api from '../../configs';
import styles from './profile.module.scss';

const { Text, Title } = Typography;
const { Option } = Select;

function Profile() {
  console.log('Profile render');

  const user = useSelector((state) => state.user.user); // Get user data from Redux store
  const [profile, setProfile] = useState(null);
  const [form] = Form.useForm(); // Create a form instance

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (user) {
          const response = await api.get('/user/get-profile', {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          setProfile(response.data);
          console.log('User profile:', response.data);
        } else {
          console.log('No user data found');
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]); // Chỉ gọi API khi `user` có dữ liệu

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        fullname: profile.fullName,
        dob: profile.dob ? moment(profile.dob) : null,
        phone: profile.phone,
        email: profile.email,
        address: profile.address,
        province: profile.province,
        district: profile.district,
        ward: profile.ward,
        createAt: profile.createAt ? moment(profile.createAt) : null, // Convert createAt to moment object
      });
    }
  }, [profile, form]); // Update form values when profile changes

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
              <Title level={3}>{(profile && profile.fullName) || 'Đang tải...'}</Title>
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
              form={form} // Bind form instance to Form component
              layout="vertical"
              initialValues={{
                fullname: profile ? profile.fullName : '',
                phone: profile ? profile.phone : '',
                email: profile ? profile.email : '',
                address: profile ? profile.address : '',
                province: profile ? profile.province : '',
                district: profile ? profile.district : '',
                ward: profile ? profile.ward : '',
                createAt: profile ? moment(profile.createAt) : null, // Convert createAt to moment object
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
              <Form.Item className={styles.shortInput} label="Ngày tham gia" name="createAt">
                <DatePicker format="DD/MM/YYYY" disabled />
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
