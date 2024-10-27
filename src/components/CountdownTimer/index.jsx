import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import dayjs from 'dayjs';
import styles from './index.module.scss';

const { Text } = Typography;

const CountdownTimer = ({ endTime, status, title }) => {
  const [timeLeft, setTimeLeft] = useState({});

  const isValidTime = dayjs(endTime).isValid();
  const deadline = isValidTime ? dayjs(endTime).valueOf() : null;

  const currentTime = dayjs().valueOf();
  const isTimeEnded = deadline && deadline <= currentTime;

  const calculateTimeLeft = () => {
    const now = dayjs();
    const difference = deadline - now;
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  useEffect(() => {
    if (deadline && !isTimeEnded) {
      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [deadline, isTimeEnded]);

  return (
    <div className={styles.timer}>
      <Text className={styles.timerTitle} strong={false}>
        {title}
      </Text>
      <div className={styles.timerContainer}>
        {isValidTime ? (
          isTimeEnded || status === 'Closed' || status === 'Finished' ? (
            <Text type="danger">Đã kết thúc</Text>
          ) : (
            <>
              {timeLeft.days > 0 && (
                <div className={styles.timerBox}>
                  <span className={styles.number}>{timeLeft.days}</span>
                  <span className={styles.label}>NGÀY</span>
                </div>
              )}
              <div className={styles.timerBox}>
                <span className={styles.number}>{timeLeft.hours}</span>
                <span className={styles.label}>GIỜ</span>
              </div>
              <div className={styles.timerBox}>
                <span className={styles.number}>{timeLeft.minutes}</span>
                <span className={styles.label}>PHÚT</span>
              </div>
              <div className={styles.timerBox}>
                <span className={styles.number}>{timeLeft.seconds}</span>
                <span className={styles.label}>GIÂY</span>
              </div>
            </>
          )
        ) : (
          <Text type="warning">Không xác định</Text>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;
