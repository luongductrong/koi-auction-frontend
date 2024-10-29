import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flex, Typography, Spin } from 'antd';
import Slider from '../../components/Slider';
import AuctionHome from '../../components/AuctionHome';
import api from '../../configs';
import styles from './index.module.scss';

const { Text, Title } = Typography;

function Home({ children }) {
  const [scheduledAuctions, setScheduledAuctions] = useState([]);
  const [ongoingAuctions, setOngoingAuctions] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);

  useEffect(() => {
    const fetchScheduledAuctions = async () => {
      try {
        setLoading1(true);
        const response = await api.get('/auction/filter?page=0&size=4&status=scheduled&desc=ASC');
        console.log('Scheduled Response:', response.data.auctions);
        setScheduledAuctions(response.data.auctions);
      } catch (error) {
        console.error('Error fetching scheduled auctions:', error);
      } finally {
        setLoading1(false);
      }
    };

    const fetchOngoingAuctions = async () => {
      try {
        setLoading2(true);
        const response = await api.get('/auction/filter?page=0&size=4&status=ongoing&desc=DESC');
        console.log('Ongoing Response:', response.data.auctions);
        setOngoingAuctions(response.data.auctions);
      } catch (error) {
        console.error('Error fetching ongoing auctions:', error);
      } finally {
        setLoading2(false);
      }
    };

    fetchScheduledAuctions();
    fetchOngoingAuctions();
  }, []);

  return (
    <>
      <Slider />
      <AuctionHome auctions={scheduledAuctions} type="scheduled" loading={loading1} />
      <AuctionHome auctions={ongoingAuctions} type="ongoing" loading={loading2} />
      <Link to="/account-center">Trung tâm tài khoản</Link>
      <br />
      <Link to="/auction">Cuộc đấu giá</Link>
      <br />
      <Link to="/forgot-password">Quên mật khẩu?</Link>
      <br />
      <Link to="/auction/details">Chi tiết đấu giá</Link>
      <br />
      <Link
        href="#auction"
        onClick={(e) => {
          e.preventDefault();
          const element = document.getElementById('auction');
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - 120;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }}
      >
        Khám phá
      </Link>

      <h2>{children}</h2>
    </>
  );
}

export default Home;
