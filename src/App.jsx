import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { publicRoutes } from './routes';
import Header from './components/Header';
// import './App.scss';

const { Content, Footer } = Layout;

function App() {
  return (
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
  );
}

export default App;
