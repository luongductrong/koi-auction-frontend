import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Checkbox, App } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../../redux/userSlice';
import GoogleLogin from '../../components/GoogleLogin';
import api from '../../configs';
import styles from './index.module.scss';

function Login() {
  console.log('Login render');

  const { message } = App.useApp();
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
        message.success('Đăng nhập thành công!');
        console.log('Login Response:', response.data);

        dispatch(setUser(response.data));
        navigate('/');
      } else {
        message.error('Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.');
        console.error('Login Error:', response.data);
      }
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
        <GoogleLogin />
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
