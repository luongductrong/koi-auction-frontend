import { useEffect, useState } from 'react';
import { Flex, Space, Typography, Avatar, ConfigProvider } from 'antd';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import api, { provinceApi } from '../../configs';
import styles from './profile.module.scss';

const { Title } = Typography;
const { Option } = Select;

function Profile() {
  console.log('Profile render');
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/user/get-profile', {
          requiresAuth: true,
          onUnauthorizedCallback: () => {
            navigate('/login');
          },
        });
        setProfile(response.data);
        console.log('User profile:', response.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      let decodeAddress = null;

      try {
        decodeAddress = JSON.parse(profile.address ? profile.address : '{}');
      } catch (error) {
        decodeAddress = { address: profile.address };
      }

      form.setFieldsValue({
        fullname: profile.fullName,
        username: profile.userName,
        phone: profile.phoneNumber,
        email: profile.email,
        address: decodeAddress.address,
        province: decodeAddress.province,
        district: decodeAddress.district,
        ward: decodeAddress.ward,
        createAt: profile.createAt ? moment(profile.createAt) : null, // Convert createAt to moment object
      });
    }
  }, [profile, form]); // Update form values when profile changes

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await provinceApi.get('/1/0.htm');
        setProvinces(response.data.data);
      } catch (error) {
        console.error('Failed to fetch provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceChange = (value, option) => {
    form.setFieldsValue({
      province: option.label,
      district: null,
      ward: null,
    });

    const fetchDistricts = async () => {
      try {
        const response = await provinceApi.get(`/2/${option.value}.htm`);
        setDistricts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch Districts:', error);
      }
    };
    fetchDistricts();
  };

  const handleDistrictChange = (value, option) => {
    form.setFieldsValue({
      district: option.label,
      ward: null,
    });

    const fetchWards = async () => {
      try {
        const response = await provinceApi.get(`/3/${option.value}.htm`);
        setWards(response.data.data);
      } catch (error) {
        console.error('Failed to fetch Wards:', error);
      }
    };
    fetchWards();
  };

  const handleWardChange = (value, option) => {
    form.setFieldsValue({
      ward: option.label,
    });
    console.log('Form:', form.getFieldsValue());
  };

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
                {` ${profile ? (profile.role === 'Breeder' ? 'Nhà bán hàng' : 'Người mua') : 'Đang tải...'}`}
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
                fullname: 'Đang tải...',
                username: 'Đang tải...',
                phone: 'Đang tải...',
                email: 'Đang tải...',
                address: 'Đang tải...',
                province: 'Đang tải...',
                district: 'Đang tải...',
                ward: 'Đang tải...',
                createAt: null,
              }}
              className={styles.form}
            >
              <Form.Item
                label="Họ và tên"
                name="fullname"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input
                  count={{
                    show: true,
                    max: 100,
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Tên đăng nhập"
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
              >
                <Input
                  count={{
                    show: true,
                    max: 50,
                  }}
                />
              </Form.Item>
              <Form.Item
                className={styles.shortInput}
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input
                  count={{
                    show: true,
                    max: 10,
                  }}
                />
              </Form.Item>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                <Input
                  count={{
                    show: true,
                    max: 100,
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Tỉnh/Thành phố"
                name="province"
                rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
              >
                <Select onChange={(value, option) => handleProvinceChange(value, option)}>
                  {provinces.map((province) => (
                    <Option key={province.id} value={province.id} label={province.full_name}>
                      {province.full_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Quận/Huyện"
                name="district"
                rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}
              >
                <Select
                  onChange={(value, option) => handleDistrictChange(value, option)}
                  disabled={!form.getFieldValue().province}
                >
                  {districts.map((district) => (
                    <Option key={district.id} value={district.id} label={district.full_name}>
                      {district.full_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Xã/Phường"
                name="ward"
                rules={[{ required: true, message: 'Vui lòng chọn xã/phường!' }]}
              >
                <Select
                  onChange={(value, option) => handleWardChange(value, option)}
                  disabled={!form.getFieldValue().district}
                >
                  {wards.map((ward) => (
                    <Option key={ward.id} value={ward.id} label={ward.full_name}>
                      {ward.full_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[
                  { required: true, message: 'Vui lòng nhập địa chỉ!' },
                  { max: 100, message: 'Địa chỉ không được vượt quá 100 ký tự!' },
                ]}
              >
                <Input
                  count={{
                    show: true,
                    max: 100,
                  }}
                />
              </Form.Item>
              <Form.Item className={styles.shortInput} label="Ngày tham gia" name="createAt">
                <DatePicker format="DD/MM/YYYY" disabled />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Cập Nhật Thông Tin
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
