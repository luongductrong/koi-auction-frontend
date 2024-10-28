import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button, App } from 'antd';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import api from '../../configs';
import googleIcon from '../../assets/images/google.svg';

const btnStyle = { width: '100%', height: '40px' };

const spanStyle = { display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-evenly' };

function GoogleLogin() {
  const { message } = App.useApp();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (response) => {
      if (response?.access_token) {
        console.log('Login Google:', response.access_token);
        loginSystem(response.access_token);
      } else {
        message.error('Lỗi truy cập vào tài khoản Google.');
      }
    },
    onError: (error) => {
      console.log('Login Failed:', error);
      message.error('Lỗi truy cập vào tài khoản Google.');
    },
  });

  const loginSystem = async (accessToken) => {
    try {
      setLoading(true);
      console.log('Login Google:', accessToken);
      const loginResponse = await api.post('/security/google/login', accessToken, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });

      if (loginResponse.status === 200) {
        message.success('Đăng nhập thành công!');
        console.log('Login Response:', loginResponse.data);

        dispatch(setUser(loginResponse.data));
        navigate('/');
      } else {
        message.error('Đăng nhập thất bại! Vui lòng thử lại sau.');
        console.error('Login Error:', loginResponse.data);
      }
    } catch (error) {
      message.error('Đăng nhập thất bại! Vui lòng thử lại sau.');
      console.error('Login Error:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="default" htmlType="button" style={btnStyle} onClick={login} loading={loading}>
      <span style={spanStyle}>
        <img src={googleIcon} alt="Google icon" width="24" height="24" />
        <p> Đăng nhập bằng Google</p>
      </span>
    </Button>
  );
}

export default GoogleLogin;
