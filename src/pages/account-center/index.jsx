import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import AntSider from '../../components/AccountSider';
import NotFound from '../not-found';
import Profile from './profile';
import Wallet from './wallet';
import Schedule from './schedule';
import Order from './order';
import AuctionManage from './auction-manage';
import KoiManage from './koi-manage';
import styles from './index.module.scss';

const { Content: AntContent } = Layout;

const routes = [
  { path: 'profile', component: Profile },
  { path: 'wallet-manage', component: Wallet },
  { path: 'schedule-manage', component: Schedule },
  { path: 'order-manage', component: Order },
  { path: 'auction-manage', component: AuctionManage },
  { path: 'koi-manage', component: KoiManage },
];

function AccountCenter() {
  console.log('Account Center render');

  return (
    <Layout>
      <AntSider />
      <AntContent className={styles.content}>
        <Routes>
          <Route index element={<Profile />} />
          {routes.map((route, index) => {
            const Page = route.component;
            return <Route key={index} path={route.path} element={<Page />} />;
          })}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AntContent>
    </Layout>
  );
}

export default AccountCenter;
