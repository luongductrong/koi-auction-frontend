import React, { useState, useEffect } from 'react';
import { Button, Form, App, Steps, Select, Input, Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import api, { provinceApi } from '../../configs';
import { debounce } from '../../utils/debounce';
import styles from './index.module.scss';

const { Option } = Select;
const { Step } = Steps;

function Register() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [validateStatusUserName, setValidateStatusUserName] = useState('');
  const [validateStatusEmail, setValidateStatusEmail] = useState('');
  const [validateStatusPhoneNumber, setValidateStatusPhoneNumber] = useState('');
  console.log('Register render');

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await provinceApi.get('/1/0.htm');
        setProvinces(response.data.data);
      } catch (error) {
        console.error('Failed to fetch provinces:', error);
        message.error('Lỗi khi tải danh sách tỉnh thành!');
      }
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = (_, option) => {
    form.setFieldsValue({
      province: option.label,
      district: null,
      ward: null,
    });
    setWards([]);

    // Tải danh sách quận
    const fetchDistricts = async () => {
      try {
        const response = await provinceApi.get(`/2/${option.value}.htm`);
        setDistricts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch districts:', error);
        message.error('Lỗi khi tải danh sách quận huyện!');
      }
    };
    fetchDistricts();
  };

  const handleDistrictChange = (_, option) => {
    form.setFieldsValue({
      district: option.label,
      ward: null,
    });

    const fetchWards = async () => {
      try {
        const response = await provinceApi.get(`/3/${option.value}.htm`);
        setWards(response.data.data);
      } catch (error) {
        console.error('Failed to fetch wards:', error);
        message.error('Lỗi khi tải danh sách xã phường!');
      }
    };
    fetchWards();
  };

  const handleWardChange = (_, option) => {
    form.setFieldsValue({
      ward: option.label,
    });
  };

  const next = (values) => {
    setFormData({ ...formData, ...values });
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const debouncedApiCall = debounce(async (url, onSuccess, onError) => {
    try {
      await api.get(url);
      onSuccess();
    } catch (error) {
      console.error('Check Exist Error:', error);
      onError();
    }
  }, 500);

  const checkValidate = (field, value) => {
    if (!value || value.trim() === '') {
      if (field.toLowerCase() === 'username') {
        setValidateStatusUserName('error');
        console.log('Empty value:', field);
      } else if (field.toLowerCase() === 'email') {
        setValidateStatusEmail('error');
      } else if (field.toLowerCase() === 'phone') {
        setValidateStatusPhoneNumber('error');
      }
      return;
    }
    if (!value || value.trim() === '') {
      console.log('Empty value:', 'return thất bại');
    }
    if (field.toLowerCase() === 'username' && !/^[a-zA-Z]{1}[a-zA-Z0-9]*$/.test(value)) {
      setValidateStatusUserName('error');
      return;
    }

    if (field.toLowerCase() === 'username') {
      setValidateStatusUserName('validating');
      debouncedApiCall(
        `/verify/verify-userName?userName=${value}`,
        () => setValidateStatusUserName('success'),
        () => setValidateStatusUserName('error'),
      );
    } else if (field.toLowerCase() === 'email') {
      setValidateStatusEmail('validating');
      debouncedApiCall(
        `/verify/verify-email?email=${value}`,
        () => setValidateStatusEmail('success'),
        () => setValidateStatusEmail('error'),
      );
    } else if (field.toLowerCase() === 'phone') {
      setValidateStatusPhoneNumber('validating');
      debouncedApiCall(
        `/verify/verify-phone?phone=${value}`,
        () => setValidateStatusPhoneNumber('success'),
        () => setValidateStatusPhoneNumber('error'),
      );
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);

      const req = formData;
      req.address = JSON.stringify({
        province: req.province,
        district: req.district,
        ward: req.ward,
        address: req.address,
      });

      delete req.province;
      delete req.district;
      delete req.ward;
      delete req.agreement;
      delete req.confirmPassword;

      console.log('Register Request:', req);

      const response = await api.post('/security/register', req);
      message.success('Đăng ký tài khoản thành công!');
      navigate('/login');
      console.log('Register Response:', response.data);
    } catch (error) {
      message.error('Đăng ký thất bại. Vui lòng thử lại!');
      console.error('Register Error:', error?.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    if (currentStep === steps.length - 1) {
      setFormData({ ...formData, ...values });
      handleRegister();
    } else {
      next(values);
    }
  };

  const steps = [
    {
      title: 'Thông tin tài khoản',
      content: (
        <>
          <Form.Item
            label="Tên đăng nhập"
            name="userName"
            hasFeedback
            validateStatus={validateStatusUserName}
            rules={[
              { required: true, message: 'Vui lòng điền tên đăng nhập!' },
              { max: 50, message: 'Không được vượt quá 50 ký tự!' },
              {
                pattern: /^[a-zA-Z]{1}[a-zA-Z0-9]*$/,
                message: 'Bắt đầu bằng chữ cái và chỉ bao gồm chữ cái và số',
              },
            ]}
          >
            <Input
              placeholder="Tên đăng nhập"
              onChange={(e) => {
                checkValidate('userName', e.target.value);
              }}
              count={{
                show: false,
                max: 50,
              }}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            hasFeedback
            validateStatus={validateStatusEmail}
            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
          >
            <Input
              placeholder="Email"
              count={{
                show: false,
                max: 100,
              }}
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Thông tin cá nhân',
      content: (
        <>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên!' },
              { max: 100, message: 'Họ tên không được vượt quá 100 ký tự!' },
            ]}
          >
            <Input placeholder="Họ và tên" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            hasFeedback
            validateStatus={validateStatusPhoneNumber}
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải bao gồm 10 chữ số!' },
            ]}
          >
            <Input
              placeholder="Số điện thoại"
              count={{
                show: true,
                max: 10,
              }}
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Địa chỉ',
      content: (
        <>
          <Form.Item
            label="Tỉnh/Thành phố"
            name="province"
            rules={[{ required: true, message: 'Vui lòng thêm thông tin tỉnh thành!' }]}
          >
            <Select onChange={handleProvinceChange}>
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
            rules={[{ required: true, message: 'Vui lòng thêm thông tin quận huyện!' }]}
          >
            <Select onChange={handleDistrictChange} disabled={!form.getFieldValue().province && !districts?.length > 0}>
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
            rules={[{ required: true, message: 'Vui lòng thêm thông tin xã phường!' }]}
          >
            <Select onChange={handleWardChange} disabled={!form.getFieldValue().district && !wards?.length > 0}>
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
              { required: true, message: 'Vui lòng nhập địa chỉ chi tiết!' },
              { max: 100, message: 'Địa chỉ không được vượt quá 100 ký tự!' },
            ]}
          >
            <Input placeholder="Địa chỉ" />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Mật khẩu',
      content: (
        <>
          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu" />
          </Form.Item>
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('Bạn phải đồng ý với điều khoản')),
              },
            ]}
          >
            <Checkbox>
              Tôi đồng ý với <Link to="/terms">điều khoản sử dụng</Link>.
            </Checkbox>
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerForm}>
        <h2 className={styles.registerTitle}>Đăng ký</h2>
        <div className={styles.registerContent}>
          <Form form={form} name="register" onFinish={onFinish} layout="vertical" className={styles.formStepContent}>
            {steps[currentStep].content}
            <div className={styles.stepActions}>
              {currentStep > 0 && (
                <Button onClick={prev} className={styles.stepActions}>
                  Quay lại
                </Button>
              )}
              <Button type="primary" htmlType="submit" loading={loading}>
                {currentStep === steps.length - 1 ? 'Đăng ký' : 'Tiếp tục'}
              </Button>
            </div>
          </Form>

          <Link to="/login" className={styles.loginLink}>
            Đã có tài khoản? Đăng nhập ngay!
          </Link>
        </div>

        <div>
          <Steps current={currentStep} direction="vertical">
            {steps.map((step) => (
              <Step key={step.title} title={step.title} />
            ))}
          </Steps>
        </div>
      </div>
    </div>
  );
}

export default Register;
