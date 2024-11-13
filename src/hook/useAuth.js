import { useNavigate } from 'react-router-dom';
import { clearUser } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { App } from 'antd';

function useAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message } = App.useApp();
  const user = useSelector((state) => state.user.user);

  const { pathname, search, hash } = window.location;
  const fullPath = pathname + search + hash;
  console.log('Full Path:', fullPath);

  const onUnauthorized = ({
    clear = false,
    success = false,
    info = false,
    warning = false,
    error = false,
    messageText,
    messageTextIfNotLogin,
    navigation = false,
  } = {}) => {
    if (user && messageText) {
      if (success) {
        message.success(messageText);
      } else if (info) {
        message.info(messageText);
      } else if (warning) {
        message.warning(messageText);
      } else if (error) {
        message.error(messageText);
      }
    }

    if (!user && messageTextIfNotLogin) {
      if (success) {
        message.success(messageTextIfNotLogin);
      } else if (info) {
        message.info(messageTextIfNotLogin);
      } else if (warning) {
        message.warning(messageTextIfNotLogin);
      } else if (error) {
        message.error(messageTextIfNotLogin);
      }
    }

    if (navigation) {
      navigate(`/login?redirect=${fullPath}`);
    }

    if (clear) {
      dispatch(clearUser());
    }
  };

  const onAccessDenied = () => {
    navigate('/access-denied');
  };

  return { onUnauthorized, onAccessDenied };
}

export default useAuth;
