import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';

function Home({ children }) {
  return (
    <>
      <h1>Home Page</h1>

      <Link to="/login">Đăng nhập</Link>
      <h2>{children}</h2>
      <Logo />
    </>
  );
}

export default Home;
