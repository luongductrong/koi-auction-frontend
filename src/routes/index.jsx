import Home from '../pages/home';
import Login from '../pages/login';
import Register from '../pages/register';
import ForgotPassword from '../pages/forgot-password';
import AccountCenter from '../pages/account-center';
import Auction from '../pages/auction';
import AuctionDetail from '../pages/auction-detail';
import BidPage from '../pages/bid';
import AccessDenied from '../pages/access-denied';
import NotFound from '../pages/not-found';

const publicRoutes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/auction', component: Auction },
  { path: '/auction/detail', component: AuctionDetail },
  { path: '/auction/bid', component: BidPage },
  { path: '/access-denied', component: AccessDenied },
  { path: '*', component: NotFound },
]; // No authentication required

const privateRoutes = [{ path: '/account-center/*', component: AccountCenter }]; // Authentication required

export { publicRoutes, privateRoutes };
