import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../src/redux/store';
import { Layout } from 'antd';
import { publicRoutes } from './routes';
import Header from './components/Header';
import Content from './components/Content';

const { Footer } = Layout;

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout style={{ minHeight: '100vh' }}>
          <Header />
          <Content>
            <Routes>
              {publicRoutes.map((route, index) => {
                const Page = route.component;
                return <Route key={index} path={route.path} element={<Page />} />;
              })}
            </Routes>
          </Content>
          <Footer style={{ textAlign: 'center' }}>This is Footer</Footer>
        </Layout>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
