import React, { useState } from 'react';
import { Button, Form, Input, Checkbox } from 'antd';
import Header from '../../components/Header';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleFinish = (values) => {
    setLoading(true);
    console.log('Login Success:', values);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Header />
      <div>
        <div>
          <h2>Đăng nhập</h2>
          <Form name="login" onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
            <Form.Item
              label="Tên đăng nhập/Email"
              name="username"
              rules={[{ required: true, message: 'Vui lòng điền tên đăng nhập hoặc email!' }]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox onChange={(e) => setRememberMe(e.target.checked)}>Ghi nhớ cho lần đăng nhập sau</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
