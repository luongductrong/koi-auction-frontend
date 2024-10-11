import Home from '../pages/home';
import Login from '../pages/login';
import Register from '../pages/register';
import AccountCenter from '../pages/account-center';
import AccessDenied from '../pages/access-denied';
import NotFound from '../pages/not-found';

const publicRoutes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/access-denied', component: AccessDenied },
  { path: '*', component: NotFound },
]; // No authentication required

const privateRoutes = [{ path: '/account-center/*', component: AccountCenter }]; // Authentication required

export { publicRoutes, privateRoutes };
