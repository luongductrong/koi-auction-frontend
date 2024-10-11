import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain',
  },
});

const requestInterceptors = (store) => {
  api.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const token = state.user.user?.token;

      if (config.requiresAuth && token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (config.requiresAuth) {
        console.error('Token not available!');
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log(error.response.message);
      console.error('Unauthorized!');
      if (error.config.onUnauthorizedCallback) {
        error.config.onUnauthorizedCallback();
      }
    }
    return Promise.reject(error);
  },
);

export { requestInterceptors };
export default api;

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.status === 401) {

//       if (error.config.url.includes('/login')) {
//         console.error('Sai mật khẩu!');
//         /////........................
//       } else {
//         console.error('Unauthorized! Redirecting to login...');
//         if (error.config.onUnauthorizedCallback) {
//           error.config.onUnauthorizedCallback();
//         }
//       }
//     }
//     return Promise.reject(error);
//   },
// );
