import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

const publicRoutes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '*', component: NotFound },
]; // No authentication required

const privateRoutes = [
  // Example: { path: '/dashboard', component: Dashboard },
]; // Authentication required

export { publicRoutes, privateRoutes };
