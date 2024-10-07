import { Link } from 'react-router-dom';
import Slider from '../../components/Slider';

function Home({ children }) {
  return (
    <>
      <Slider />
      <Link to="/account-center">Trung tâm tài khoản</Link>
      <h2>{children}</h2>
    </>
  );
}

export default Home;
