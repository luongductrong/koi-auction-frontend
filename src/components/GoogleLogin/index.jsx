import { useGoogleLogin } from '@react-oauth/google';
import { Button } from 'antd';
import googleIcon from '../../assets/images/google.svg';

const styles = {
  width: '100%',
  height: '40px',
};

function GoogleLogin() {
  const login = useGoogleLogin({
    onSuccess: (response) => console.log('Login Success:', response),
    onError: (error) => console.log('Login Failed:', error),
  });

  return (
    <Button type="default" htmlType="button" style={styles} onClick={login}>
      <img src={googleIcon} alt="Google icon" width="24" height="24" />
      <p>Đăng nhập bằng Google</p>
    </Button>
  );
}

export default GoogleLogin;

// const t = {
//   access_token: "string",
//   authuser: "0",
//   expires_in: 3599,
//   hd: "fpt.edu.vn",
//   prompt: "none",
//   scope: "email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
//   token_type: "Bearer"
// };
