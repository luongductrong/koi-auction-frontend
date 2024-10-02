import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { publicRoutes } from './routes';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            return <Route key={index} path={route.path} element={<Page />} />;
          })}
        </Routes>
        {/* <Link to="/login">Login</Link> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
