import React, { useState, useEffect } from 'react';
import { Button, Card, message } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../configs';
import styles from './index.module.scss';

function AuctionResult({ auctionId, breederID, winnerId, amount, deadline, method }) {
  const user = useSelector((state) => state.user.user);
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  console.log({ auctionId, winnerId, amount, deadline, method });

  const date = new Date(deadline);
  date.setDate(date.getDate() + 2);

  const payment = async () => {
    navigate('/auction/order?id=' + auctionId);
  };

  useEffect(() => {
    const checkRegistered = async () => {
      try {
        const response = await api.get(`auction/user/check-participant-for-auction?auctionId=${auctionId}`, {
          requiresAuth: true,
        });
        if (response?.status === 200) {
          setRegistered(response?.data || false);
          console.log('Check Registered Response:', response?.data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (user && auctionId) {
      checkRegistered();
    }
  }, [user, auctionId]);

  if (breederID === user?.userId)
    return (
      <Card
        title={<span className={styles.cardTitle}>Thông tin người thắng đấu giá</span>}
        bordered={false}
        className={styles.cardContainer}
      >
        <p>
          <strong>Tên người dùng:</strong>
        </p>
        <p>
          <strong>Họ và tên:</strong>
        </p>
      </Card>
    );

  if (!user && !registered && !amount) return <></>;
  if (!user) {
    console.log('Winner:', winnerId);
    return (
      <Card
        title={<span className={styles.cardTitle}>Kết quả cuộc đấu giá</span>}
        bordered={false}
        className={styles.cardContainer}
      >
        <p>Vui lòng đăng nhập để xem kết quả.</p>
      </Card>
    );
  }
  if (!registered) {
    console.log('Winner:', winnerId);
    return (
      <Card
        title={<span className={styles.cardTitle}>Kết quả cuộc đấu giá</span>}
        bordered={false}
        className={styles.cardContainer}
      >
        <p>Bạn không tham gia cuộc đấu giá này.</p>
      </Card>
    );
  }
  if (registered && user.userId !== winnerId) {
    console.log('Winner:', winnerId);
    return (
      <Card
        title={<span className={styles.cardTitle}>Kết quả cuộc đấu giá</span>}
        bordered={false}
        className={styles.cardContainer}
      >
        <p>Bạn không thắng cuộc đấu giá này.</p>
      </Card>
    );
  }

  return (
    <Card
      title={<span className={styles.cardTitle}>Kết quả cuộc đấu giá</span>}
      bordered={false}
      className={`${styles.cardContainer} ${styles.animation}`}
    >
      <div>Chúc mừng bạn đã thắng đấu giá.</div>
      <>
        <div>Vui lòng đến trang thanh toán và tạo đơn hàng</div>
        <Button type="primary" className={styles.cardBtn} onClick={() => payment()}>
          Đến trang thanh toán
        </Button>
      </>
    </Card>
  );
}

export default AuctionResult;
