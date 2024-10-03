import { Link } from 'react-router-dom';
import Header from '../../components/Header';

function Home({ children }) {
  return (
    <>
      {/* <Header /> */}
      <h1>Home Page</h1>

      <Link to="/login">Login</Link>
      <h2>{children}</h2>
    </>
  );
}

export default Home;
