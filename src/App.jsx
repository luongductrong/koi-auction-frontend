import './polyfills';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '../src/redux/store';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GlobalStyles from './components/GlobalStyles';
import { Layout, App as AntApp } from 'antd';
import { publicRoutes, privateRoutes } from './routes';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId={clientId}>
          <GlobalStyles>
            <BrowserRouter>
              <AntApp>
                <Layout style={{ minHeight: '100vh' }}>
                  <Header />
                  <Content>
                    <Routes>
                      {publicRoutes.map((route) => {
                        const Page = route.component;
                        return <Route key={route.path} path={route.path} element={<Page />} />;
                      })}
                      {privateRoutes.map((route) => {
                        const Page = route.component;
                        return (
                          <Route
                            key={route.path}
                            path={route.path}
                            element={
                              <PrivateRoute>
                                <Page />
                              </PrivateRoute>
                            }
                          />
                        );
                      })}
                    </Routes>
                  </Content>
                  <Footer />
                </Layout>
              </AntApp>
            </BrowserRouter>
          </GlobalStyles>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
