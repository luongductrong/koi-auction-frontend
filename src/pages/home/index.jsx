import { Link } from 'react-router-dom';
import Slider from '../../components/Slider';

function Home({ children }) {
  return (
    <>
      <Slider />
      <Link to="/account-center">Trung tâm tài khoản</Link>
      <br />
      <Link to="/auction">Cuộc đấu giá</Link>
      <h2>{children}</h2>
    </>
  );
}

export default Home;

//Add comment to make Git recognize directory name changes
