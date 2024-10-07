import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AccountCenter from '../pages/AccountCenter';
import NotFound from '../pages/NotFound';

const publicRoutes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/account-center', component: AccountCenter },
  { path: '*', component: NotFound },
]; // No authentication required

const privateRoutes = [
  // Example: { path: '/dashboard', component: Dashboard },
]; // Authentication required

export { publicRoutes, privateRoutes };
