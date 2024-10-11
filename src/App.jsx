import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '../src/redux/store';
import GlobalStyles from './components/GlobalStyles';
import { Layout } from 'antd';
import { publicRoutes } from './routes';
import Header from './components/Header';
import Content from './components/Content';

const { Footer } = Layout;

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GlobalStyles>
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
        </GlobalStyles>
      </PersistGate>
    </Provider>
  );
}

export default App;
