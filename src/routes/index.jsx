import Home from '../pages/home';
import Login from '../pages/login';
import Register from '../pages/register';
import ForgotPassword from '../pages/forgot-password';
import AccountCenter from '../pages/account-center';
import Auction from '../pages/auction';
import AuctionDetail from '../pages/auction-detail';
import BidPage from '../pages/bid';
import Order from '../pages/order';
import Blog from '../pages/blog';
import AboutPage from '../pages/about';
import Contact from '../pages/contact';
import Policy from '../pages/policy';
import AccessDenied from '../pages/access-denied';
import NotFound from '../pages/not-found';

const publicRoutes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/auction', component: Auction },
  { path: '/auction/detail', component: AuctionDetail },
  { path: '/blog', component: Blog },
  { path: '/about', component: AboutPage },
  { path: '/contact', component: Contact },
  { path: '/policy', component: Policy },
  { path: '/auction/bid', component: BidPage },
  { path: '/access-denied', component: AccessDenied },
  { path: '*', component: NotFound },
]; // No authentication required

const privateRoutes = [
  { path: '/account-center/*', component: AccountCenter },
  { path: '/auction/order', component: Order },
]; // Authentication required

export { publicRoutes, privateRoutes };
