import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Checkbox, App } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../../redux/userSlice';
import GoogleLogin from '../../components/GoogleLogin';
import api from '../../configs';
import styles from './index.module.scss';

function Login() {
  console.log('Login render');

  const { message } = App.useApp();
  const location = useLocation();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearUser());
  }, []);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/security/login', {
        userName: values.username,
        password: values.password,
      });

      if (response.status === 200) {
        message.success(t('page.login.login_success'));
        console.log('Login Response:', response.data);

        dispatch(setUser(response.data));
        const redirect = new URLSearchParams(location.search).get('redirect');
        if (redirect) {
          navigate(redirect !== '/login' && redirect !== '/register' ? redirect : '/');
        } else {
          navigate('/');
        }
      } else {
        message.error(t('page.login.login_failure'));
        console.error('Login Error:', response.data);
      }
    } catch (error) {
      message.error(t('page.login.login_failure'));
      console.error('Login Error:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = (values) => {
    console.log('Login Success:', values);
    handleLogin(values);
  };

  const handleFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2 className={styles.loginTitle}>{t('page.login.title')}</h2>
        <Form
          name="login"
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
          layout="vertical"
          className={styles.form}
        >
          <Form.Item
            label={t('page.login.username_label')}
            name="username"
            rules={[{ required: true, message: t('page.login.username_required') }]}
          >
            <Input placeholder={t('page.login.username_placeholder')} />
          </Form.Item>
          <Form.Item
            label={t('page.login.password_label')}
            name="password"
            rules={[{ required: true, message: t('page.login.password_required') }]}
          >
            <Input.Password placeholder={t('page.login.password_placeholder')} />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox onChange={(e) => setRememberMe(e.target.checked)}>{t('page.login.remember_me')}</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className={styles.loginBtn}>
              {loading ? t('page.login.login_button_loading') : t('page.login.login_button')}
            </Button>
          </Form.Item>
        </Form>
        <GoogleLogin />
        <Link to="/forgot-password" className={styles.forgotPasswordLink}>
          {t('page.login.forgot_password')}
        </Link>
        <Link to="/register" className={styles.forgotPasswordLink}>
          {t('page.login.register')}
        </Link>
      </div>
    </div>
  );
}

export default Login;
