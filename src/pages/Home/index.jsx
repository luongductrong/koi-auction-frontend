import { Link } from 'react-router-dom';
import Slider from '../../components/Slider';

function Home({ children }) {
  return (
    <>
      <Slider />
      <Link to="/login">Đăng nhập</Link>
      <h2>{children}</h2>
    </>
  );
}

export default Home;
