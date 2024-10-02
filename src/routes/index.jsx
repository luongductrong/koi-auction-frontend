import Home from '../pages/Home';
import Login from '../pages/Login';

const publicRoutes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
]; //không cần đăng nhập

const privateRoutes = []; //đăng nhập

export { publicRoutes, privateRoutes };
