import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import AntSider from '../../components/AccountSider';
import NotFound from '../not-found';
import Profile from './profile';
import styles from './index.module.scss';

const { Content: AntContent } = Layout;

const routes = [
  { path: 'profile', component: Profile },
  { path: 'wallet-manage', component: NotFound },
  { path: 'schedule-manage', component: NotFound },
  { path: 'order-manage', component: NotFound },
  { path: 'auction-manage', component: NotFound },
  { path: 'koi-manage', component: NotFound },
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
