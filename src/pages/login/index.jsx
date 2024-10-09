import React, { useState } from 'react';
import { Button, Form, Input, Checkbox, message } from 'antd';
import { Link } from 'react-router-dom';
import api from '../../configs';
import styles from './index.module.scss';
import googleIcon from '../../assets/images/google.svg';

function Login() {
  console.log('Login render');

  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/security/login', {
        userName: values.username,
        password: values.password,
      });
      message.success('Đăng nhập thành công!');
      console.log('Login Response:', response.data);
    } catch (error) {
      message.error('Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.');
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
        <h2 className={styles.loginTitle}>Đăng nhập</h2>
        <Form name="login" onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
          <Form.Item
            label="Tên đăng nhập/Email"
            name="username"
            rules={[{ required: true, message: 'Vui lòng điền tên đăng nhập hoặc email!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox onChange={(e) => setRememberMe(e.target.checked)}>Ghi nhớ cho lần đăng nhập sau</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className={styles.loginBtn}>
              {loading ? 'Đăng nhập...' : 'Đăng nhập'}
            </Button>
          </Form.Item>
        </Form>
        <Button type="default" htmlType="button" className={styles.loginBtn}>
          <img src={googleIcon} alt="Google icon" width="24" height="24" />
          <p>Đăng nhập bằng Google</p>
        </Button>
        <Link to="/forgot-password" className={styles.forgotPasswordLink}>
          Quên mật khẩu?
        </Link>
        <Link to="/register" className={styles.forgotPasswordLink}>
          Đăng ký
        </Link>
      </div>
    </div>
  );
}

export default Login;