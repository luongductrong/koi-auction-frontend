import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>Nội dung truy cập không tồn tại</p>
      <Link to="/">
        <button>Về Trang chủ</button>
      </Link>
    </div>
  );
}

export default NotFound;
