import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { Button, App } from 'antd';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../configs';
import googleIcon from '../../assets/images/google.svg';

const btnStyle = { width: '100%', height: '40px' };

const spanStyle = { display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-evenly' };

function GoogleLogin() {
  const { message, notification } = App.useApp();
  const location = useLocation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (response) => {
      if (response?.access_token) {
        console.log('Login Google:', response.access_token);
        loginSystem(response.access_token);
      } else {
        message.error(t('component.google_login.login_error'));
      }
    },
    onError: (error) => {
      console.log('Login Failed:', error);
      message.error(t('component.google_login.login_error'));
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
        const role = loginResponse?.data?.role;
        if (role !== 'User' && role !== 'Breeder') {
          navigate('/access-denied');
          return;
        }

        if (loginResponse?.data?.address === null || loginResponse?.data?.address === '') {
          notification.warning({
            message: 'Cập nhật thông tin cá nhân',
            description: 'Thông tin cá nhân của bạn hiện chưa đầy đủ, vui lòng cập nhật lại thông tin.',
            placement: 'bottomRight',
            duration: 0,
            rtl: true,
          });
        }
        message.success(t('component.google_login.login_success'));
        console.log('Login Response:', loginResponse.data);

        dispatch(setUser(loginResponse.data));
        const redirect = new URLSearchParams(location.search).get('redirect');
        if (redirect) {
          navigate(redirect !== '/login' && redirect !== '/register' ? redirect : '/');
        } else {
          navigate('/');
        }
      } else {
        message.error(t('component.google_login.login_failure'));
        console.error('Login Error:', loginResponse.data);
      }
    } catch (error) {
      message.error(t('component.google_login.login_failure'));
      console.error('Login Error:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="default" htmlType="button" style={btnStyle} onClick={login} loading={loading}>
      <span style={spanStyle}>
        <img src={googleIcon} alt="Google icon" width="24" height="24" />
        <p> {t('component.google_login.button_text')}</p>
      </span>
    </Button>
  );
}

export default GoogleLogin;
