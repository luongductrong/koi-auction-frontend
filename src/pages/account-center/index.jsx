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
import styles from './index.module.scss';

const { Content: AntContent } = Layout;

const routes = [
  { path: 'profile', component: Profile },
  { path: 'wallet', component: Wallet },
  { path: 'schedule', component: Schedule },
  { path: 'order', component: Order },
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
            {routes.map((route, index) => {
              const Page = route.component;
              return <Route key={index} path={route.path} element={<Page />} />;
            })}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AntContent>
      </Layout>
    </ConfigProvider>
  );
}

export default AccountCenter;
