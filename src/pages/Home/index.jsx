import { Link } from 'react-router-dom';

function Home({ children }) {
  return (
    <>
      <h1>Home Page</h1>

      <Link to="/login">Login</Link>
      <h2>{children}</h2>
    </>
  );
}

export default Home;
