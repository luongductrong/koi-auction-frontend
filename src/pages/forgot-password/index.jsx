import React, { useEffect, useState } from 'react';
import { App, Form, Input, Button, Flex, ConfigProvider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../configs';
import styles from './index.module.scss';
import clsx from 'clsx';

function ForgotPassword() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [countdown, setCountdown] = useState(0);

  console.log('ForgotPassword render');

  const next = async () => {
    try {
      await form.validateFields(['email', 'password', 'confirmPassword']);
      handleSentOTP();
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const prev = () => {
    setCurrentStep(0);
  };

  const onFinish = (values) => {
    console.log('Form values:', values);
    handleResetPassword(values);
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
      const email = form.getFieldValue('email');
      form.setFieldsValue({ otp: '' });
      console.log('Email:', email);
      setCountdown(60);
      const response = await api.post(`/forgot-password/verifyMail/${email}`);
      if (response?.status === 200) {
        message.success('Mã OTP đã được gửi đến email của bạn!');
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 404) {
        message.error({
          content: 'Email không tồn tại. Vui lòng kiểm tra lại.',
          duration: 3,
        });
      } else {
        message.error({
          content: 'Có lỗi xảy ra! Vui lòng thử lại sau.',
          duration: 3,
        });
      }
    } finally {
      setLoading1(false);
    }
  };

  const handleResetPassword = async (values) => {
    try {
      setLoading2(true);
      const response = await api.post('/forgot-password/verifyAndChangePassword', {
        otp: values.otp,
        email: values.email,
        changePassword: {
          password: values.password,
          repeatPassword: values.confirmPassword,
        },
      });
      if (response) {
        message.success('Đặt lại mật khẩu thành công!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
      if (
        error.response?.status === 404 &&
        error.response?.data?.message === `Invalid OTP for email: ${values.email}`
      ) {
        message.error({
          content: 'Mã OTP không hợp lệ. Vui lòng kiểm tra lại.',
          duration: 3,
        });
      } else if (error.response?.status === 417) {
        message.error({
          content: 'OTP đã hết hạn. Vui lòng thử lại',
          duration: 3,
        });
      } else {
        message.error({
          content: 'Có lỗi xảy ra! Vui lòng thử lại sau.',
          duration: 3,
        });
      }
    } finally {
      setLoading2(false);
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
            className={clsx({ [styles.displayNone]: currentStep !== 0 })}
          >
            <Input placeholder="Nhập email khôi phục..." />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
            className={clsx({ [styles.displayNone]: currentStep !== 0 })}
          >
            <Input.Password placeholder="Mật khẩu mới" />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={['password']}
            className={clsx({ [styles.displayNone]: currentStep !== 0 })}
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
          className={clsx({ [styles.displayNone]: currentStep === 0 })}
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
            {steps[0].content}
            {steps[1].content}
            <Flex justify="space-between" className={styles.btnGroup}>
              {currentStep === 0 && (
                <Button type="primary" loading={loading1} onClick={() => next()}>
                  {loading1 ? 'Tiếp tục...' : 'Tiếp tục'}
                </Button>
              )}
              {currentStep > 0 && (
                <>
                  {loading2 || <Button onClick={() => prev()}>Quay lại</Button>}
                  <Button type="primary" loading={loading2} htmlType="submit">
                    {loading2 ? 'Đặt mật khẩu mới...' : 'Đặt mật khẩu'}
                  </Button>
                </>
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
                  <Button type="link" onClick={() => handleSentOTP()} disabled={countdown > 0}>{`Gửi lại ${
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
