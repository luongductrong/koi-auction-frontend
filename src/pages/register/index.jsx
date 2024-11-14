import React, { useState, useRef } from 'react';
import { Button, Form, App, Steps, Input, Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import api from '../../configs';
import styles from './index.module.scss';

const { Step } = Steps;

function Register() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [formData, setFormData] = useState({});
  const [validateStatusUserName, setValidateStatusUserName] = useState('');
  const [validateStatusEmail, setValidateStatusEmail] = useState('');
  const useLatestRequestId = useRef(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  console.log('Register render');

  const getOtp = async () => {
    try {
      setLoading(true);
      const response = await api.post('/security/register', formData);
      message.success('Mã OTP đã được gửi đến email của bạn!');
      console.log('Get OTP Response:', response.data);
    } catch (error) {
      message.error('Lỗi khi gửi mã OTP! Vui lòng thử lại sau.');
      console.error('Get OTP Error:', error?.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const next = (values) => {
    setFormData({ ...formData, ...values });
    setCurrentStep(currentStep + 1);
    if (currentStep === 1) {
      getOtp();
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const debouncedApiCall = debounce(async (field, value, requestId, onSuccess, onError) => {
    try {
      if (field.toLowerCase() === 'email') {
        await api.get(`/verify/verify-email?email=${value}`);
      } else if (field.toLowerCase() === 'username') {
        await api.get(`/verify/verify-userName?userName=${value}`);
      } else {
        throw new Error('Invalid field');
      }
      if (requestId === useLatestRequestId.current) {
        onSuccess();
      }
    } catch (error) {
      if (requestId === useLatestRequestId.current) {
        onError();
      }
    }
  }, 500);

  const checkValidate = (field, value) => {
    if (field.toLowerCase() === 'username') {
      useLatestRequestId.current += 1;
      const currentRequestId = useLatestRequestId.current;

      debouncedApiCall.cancel();

      if (!value || value.trim() === '' || !/^[a-zA-Z]{1}[a-zA-Z0-9]*$/.test(value)) {
        setValidateStatusUserName('error');
        return;
      }
      setValidateStatusUserName('validating'); // Change to username validate status
      debouncedApiCall(
        field,
        value,
        currentRequestId,
        () => setValidateStatusUserName('success'),
        () => setValidateStatusUserName('error'),
      );
    } else if (field.toLowerCase() === 'email') {
      useLatestRequestId.current += 1;
      const currentRequestId = useLatestRequestId.current;

      debouncedApiCall.cancel();

      if (!value || value.trim() === '' || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        setValidateStatusEmail('error');
        return;
      }
      setValidateStatusEmail('validating'); // Change to email validate status
      debouncedApiCall(
        field,
        value,
        currentRequestId,
        () => setValidateStatusEmail('success'),
        () => setValidateStatusEmail('error'),
      );
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      const req = formData;

      console.log('Register Request:', req);

      const response = await api.post(`/security/verify-otp?otp=${req.otp}`, req);
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
    setFormData({ ...formData, ...values });

    if (currentStep === steps.length - 1) {
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
              onChange={(e) => {
                checkValidate('email', e.target.value);
              }}
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
      title: 'Mật khẩu',
      content: (
        <>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { max: 100, message: 'Không được vượt quá 100 ký tự!' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                message: 'Mật khẩu quá yếu!',
              },
            ]}
          >
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
        </>
      ),
    },
    {
      title: 'Điều khoản',
      content: (
        <>
          <Form.Item
            label={'Nhập mã OTP'}
            name="otp"
            rules={[
              { required: true, message: 'Vui lòng nhập OTP!' },
              { pattern: /^[0-9]{6}$/, message: 'OTP không hợp lệ' },
            ]}
          >
            <Input
              value={formData.otp}
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              placeholder="Nhập mã OTP"
            />
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
          <Form name="register" onFinish={onFinish} layout="vertical" className={styles.formStepContent}>
            {steps[currentStep].content}
            <div className={styles.stepActions}>
              {currentStep > 0 && (
                <Button onClick={prev} className={styles.stepActions}>
                  Quay lại
                </Button>
              )}
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={
                  currentStep === 0 && (validateStatusEmail !== 'success' || validateStatusUserName !== 'success')
                }
              >
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
        <span className={styles.registerGuider}>
          Mật khẩu phải có ít nhất 8 kí tự, bao gồm ít 1 chữ hoa, chữ thường, số
        </span>
      </div>
    </div>
  );
}

export default Register;
