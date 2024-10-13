import React, { useEffect, useState } from 'react';
import { App, Form, Input, Button, Flex, ConfigProvider } from 'antd';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';

function ForgotPassword() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [countdown, setCountdown] = useState(0);

  console.log('ForgotPassword render');

  const next = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
      if (countdown === 0) {
        setCountdown(60);
      }
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = (values) => {
    console.log('Form values:', values);
    message.success('Thành công!');
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSentOTP = async () => {
    try {
      setLoading1(true);
      // Call API
      message.success('Mã OTP đã được gửi đến email của bạn!');
      next();
    } catch (error) {
      message.error('Error:', error.response ? error.response.data : error.message);
    } finally {
      setLoading1(false);
    }
  };

  const steps = [
    {
      content: (
        <>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
          >
            <Input placeholder="Nhập email khôi phục..." />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
          >
            <Input.Password placeholder="Mật khẩu mới" />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={['password']}
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
      content: (
        <Form.Item
          label="Mã OTP"
          name="otp"
          rules={[
            { required: true, message: 'Vui lòng nhập mã OTP!' },
            { pattern: /^[0-9]{6}$/, message: 'OTP phải bao gồm 6 chữ số!' },
          ]}
        >
          <Input.OTP length={6} />
        </Form.Item>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: '18px',
        },
      }}
    >
      <Flex justify="center" align="center" style={{ minHeight: '60vh' }}>
        <Flex wrap={true} className={styles.form}>
          <p className={styles.title}>Đặt lại mật khẩu</p>
          <Form form={form} onFinish={onFinish} layout="vertical">
            {steps[currentStep].content}
            <Flex justify="space-between" className={styles.btnGroup}>
              {currentStep > 0 && (
                <>
                  <Button style={{ marginRight: 8 }} onClick={() => prev()}>
                    Quay lại
                  </Button>
                  <Button type="primary" loading={loading2} htmlType="submit">
                    {loading2 ? 'Đặt mật khẩu mới...' : 'Đặt mật khẩu'}
                  </Button>
                </>
              )}
              {currentStep === 0 && (
                <Button type="primary" loading={loading1} onClick={() => next()}>
                  {loading1 ? 'Tiếp tục...' : 'Tiếp tục'}
                </Button>
              )}
            </Flex>
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    paddingInline: 0,
                    paddingBlock: 0,
                  },
                },
              }}
            >
              <Flex justify="space-between">
                <Link to="/login">
                  <Button type="link">Quay lại đăng nhập</Button>
                </Link>
                {currentStep > 0 && (
                  <Button type="link" disabled={countdown > 0}>{`Gửi lại ${
                    countdown > 0 ? `(${countdown})` : 'OTP'
                  }`}</Button>
                )}
              </Flex>
            </ConfigProvider>
          </Form>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
}

export default ForgotPassword;
