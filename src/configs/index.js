import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain',
  },
});

api.interceptors.request.use(
  (config) => {
    if (config.requiresAuth) {
      // const token = localStorage.getItem('token');
      const token = JSON.parse(localStorage.getItem('userData')).token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.error('Token not available!');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Redirecting to login...');
      if (error.config.onUnauthorizedCallback) {
        error.config.onUnauthorizedCallback();
      }
    }
    return Promise.reject(error);
  },
);

export default api;
