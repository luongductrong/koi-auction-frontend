import React, { useEffect, useState } from 'react';
import { App, Form, Input, Button, Flex, ConfigProvider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../configs';
import styles from './index.module.scss';
import clsx from 'clsx';

function ForgotPassword() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();
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
        message.success(t('page.forgot_password.send_otp_success'));
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 404) {
        message.error({
          content: t('page.forgot_password.email_not_exist'),
          duration: 3,
        });
      } else {
        message.error({
          content: t('page.forgot_password.unexpected_error'),
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
        message.success(t('page.forgot_password.reset_password_success'));
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
      if (
        error.response?.status === 400
        // error.response?.data?.message === `Invalid OTP for email: ${values.email}`
      ) {
        message.error({
          content: t('page.forgot_password.otp_invalid_error'),
          duration: 3,
        });
      } else if (error.response?.status === 417) {
        message.error({
          content: t('page.forgot_password.otp_expired'),
          duration: 3,
        });
      } else {
        message.error({
          content: t('page.forgot_password.unexpected_error'),
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
            label={t('page.forgot_password.email_label')}
            name="email"
            rules={[{ required: true, type: 'email', message: t('page.forgot_password.email_required') }]}
            className={clsx({ [styles.displayNone]: currentStep !== 0 })}
          >
            <Input placeholder={t('page.forgot_password.email_placeholder')} />
          </Form.Item>
          <Form.Item
            label={t('page.forgot_password.new_password_label')}
            name="password"
            rules={[{ required: true, message: t('page.forgot_password.new_password_required') }]}
            className={clsx({ [styles.displayNone]: currentStep !== 0 })}
          >
            <Input.Password placeholder={t('page.forgot_password.new_password_placeholder')} />
          </Form.Item>
          <Form.Item
            label={t('page.forgot_password.confirm_password_label')}
            name="confirmPassword"
            dependencies={['password']}
            className={clsx({ [styles.displayNone]: currentStep !== 0 })}
            rules={[
              { required: true, message: t('page.forgot_password.confirm_password_required') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('page.forgot_password.confirm_password_mismatch')));
                },
              }),
            ]}
          >
            <Input.Password placeholder={t('page.forgot_password.confirm_password_placeholder')} />
          </Form.Item>
        </>
      ),
    },
    {
      content: (
        <Form.Item
          label={t('page.forgot_password.otp_label')}
          name="otp"
          className={clsx({ [styles.displayNone]: currentStep === 0 })}
          rules={[
            { required: true, message: t('page.forgot_password.opt_required') },
            { pattern: /^[0-9]{6}$/, message: t('page.forgot_password.otp_invalid') },
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
          <p className={styles.title}>{t('page.forgot_password.title')}</p>
          <Form form={form} onFinish={onFinish} layout="vertical">
            {steps[0].content}
            {steps[1].content}
            <Flex justify="space-between" className={styles.btnGroup}>
              {currentStep === 0 && (
                <Button type="primary" loading={loading1} onClick={() => next()}>
                  {loading1
                    ? t('page.forgot_password.button_continue_loading')
                    : t('page.forgot_password.button_continue')}
                </Button>
              )}
              {currentStep > 0 && (
                <>
                  {loading2 || <Button onClick={() => prev()}>{t('page.forgot_password.button_back')}</Button>}
                  <Button type="primary" loading={loading2} htmlType="submit">
                    {loading2
                      ? t('page.forgot_password.button_reset_password_loading')
                      : t('page.forgot_password.button_reset_password')}
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
                  <Button type="link">{t('page.forgot_password.link_back_to_login')}</Button>
                </Link>
                {currentStep > 0 && (
                  <Button type="link" onClick={() => handleSentOTP()} disabled={countdown > 0}>
                    {`${t('page.forgot_password.button_resend_otp_countdown')} ${
                      countdown > 0 ? `(${countdown})` : 'OTP'
                    }`}
                  </Button>
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
