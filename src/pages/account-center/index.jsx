import { Routes, Route } from 'react-router-dom';
import { ConfigProvider, Layout } from 'antd';
import AntSider from '../../components/AccountSider';
import NotFound from '../not-found';
import Profile from './profile';
import Wallet from './wallet';
import Schedule from './schedule';
import Order from './order';
import AuctionManage from './auction-manage';
import KoiManage from './koi-manage';
import PrivateRoute from '../../components/PrivateRoute';
import styles from './index.module.scss';

const { Content: AntContent } = Layout;

const routes = [
  { path: 'profile', component: Profile },
  { path: 'wallet', component: Wallet },
  { path: 'schedule', component: Schedule },
  { path: 'order', component: Order },
];

const breederRoutes = [
  { path: 'auction', component: AuctionManage },
  { path: 'koi', component: KoiManage },
];

function AccountCenter() {
  console.log('Account Center render');

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            bodyBg: 'rgba(255, 255, 255, 0)',
          },
        },
      }}
    >
      <Layout>
        <AntSider />
        <AntContent className={styles.content}>
          <Routes>
            <Route index element={<Profile />} />
            {routes.map((route, _) => {
              const Page = route.component;
              return <Route key={`account-center/${route.path}`} path={route.path} element={<Page />} />;
            })}
            {breederRoutes.map((route, _) => {
              const Page = route.component;
              return (
                <Route
                  key={`account-center/${route.path}`}
                  path={route.path}
                  element={
                    <PrivateRoute requireRole="Breeder">
                      <Page />
                    </PrivateRoute>
                  }
                />
              );
            })}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AntContent>
      </Layout>
    </ConfigProvider>
  );
}

export default AccountCenter;
