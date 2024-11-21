import React, { useState, useEffect } from 'react';
import { Typography, Divider } from 'antd';
import dayjs from 'dayjs';
import styles from './index.module.scss';

const { Text } = Typography;

function CountdownTimer({ startTime, endTime, status, onStatusChange }) {
  const [timeLeft, setTimeLeft] = useState({});
  const [currentTarget, setCurrentTarget] = useState(null);
  const [timerTitle, setTimerTitle] = useState({ isRedColor: false, title: '' });

  const isValidStartTime = dayjs(startTime).isValid();
  const kickoff = isValidStartTime ? dayjs(startTime).valueOf() : null;

  const isValidEndTime = dayjs(endTime).isValid();
  const deadline = isValidEndTime ? dayjs(endTime).valueOf() : null;

  const currentTime = dayjs().valueOf();

  const isStatusEnded = ['Closed', 'Finished', 'Failed', 'Paid'].includes(status);
  const isStatusPending = ['Pending', 'Scheduled'].includes(status);
  const isStatusOngoing = status === 'Ongoing';

  // Determine initial target time and title
  useEffect(() => {
    if (isStatusPending && kickoff > currentTime) {
      setCurrentTarget(kickoff);
      setTimerTitle({ isRedColor: false, title: 'Bắt đầu sau' });
    } else if (isStatusOngoing && deadline > currentTime) {
      setCurrentTarget(deadline);
      setTimerTitle({ isRedColor: false, title: 'Kết thúc sau' });
    } else if (isStatusEnded && deadline < currentTime) {
      setCurrentTarget(null);
      setTimerTitle({ isRedColor: true, title: 'Cuộc đấu giá đã kết thúc' });
    } else {
      setCurrentTarget(null);
      setTimerTitle({ isRedColor: true, title: '[Lỗi dữ liệu đầu vào]' });
    }
  }, []);

  const calculateTimeLeft = (targetTime) => {
    const now = dayjs();
    const difference = targetTime - now;

    return {
      days: Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((difference / (1000 * 60 * 60)) % 24)),
      minutes: Math.max(0, Math.floor((difference / (1000 * 60)) % 60)),
      seconds: Math.max(0, Math.floor((difference / 1000) % 60)),
    };
  };

  useEffect(() => {
    if (currentTarget) {
      // Clear interval trước khi tạo mới
      const interval = setInterval(() => {
        const time = calculateTimeLeft(currentTarget);
        setTimeLeft(time);

        // Chuyển từ startTime sang endTime
        if (
          currentTarget === kickoff &&
          time.days === 0 &&
          time.hours === 0 &&
          time.minutes === 0 &&
          time.seconds === 0
        ) {
          setCurrentTarget(deadline); // Chuyển sang deadline
          setTimerTitle({ isRedColor: false, title: 'Kết thúc sau' });
          setTimeLeft(calculateTimeLeft(deadline)); // Đồng bộ ngay lập tức
          onStatusChange('Ongoing');
        }

        // Kết thúc countdown khi hết deadline
        if (
          currentTarget === deadline &&
          time.days === 0 &&
          time.hours === 0 &&
          time.minutes === 0 &&
          time.seconds === 0
        ) {
          clearInterval(interval); // Dừng đếm ngược
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          setTimerTitle({ isRedColor: true, title: 'Cuộc đấu giá đã kết thúc' });
          onStatusChange('Closed');
        }
      }, 1000);

      return () => clearInterval(interval); // Xóa interval khi component unmount hoặc currentTarget thay đổi
    }
  }, [currentTarget, kickoff, deadline]);

  return (
    <div className={styles.timer}>
      <div className={styles.timerContainer}>
        <Divider>
          <Text className={`${styles.timerTitle} ${timerTitle?.isRedColor ? styles.isRed : ''}`} strong={false}>
            {timerTitle.title}
          </Text>
        </Divider>
        {timeLeft.days > 0 && (
          <div className={styles.timerBox}>
            <span className={styles.number}>{timeLeft.days || 0}</span>
            <span className={styles.label}>NGÀY</span>
          </div>
        )}
        <div className={styles.timerBox}>
          <span className={styles.number}>{timeLeft.hours || 0}</span>
          <span className={styles.label}>GIỜ</span>
        </div>
        <div className={styles.timerBox}>
          <span className={styles.number}>{timeLeft.minutes || 0}</span>
          <span className={styles.label}>PHÚT</span>
        </div>
        <div className={styles.timerBox}>
          <span className={styles.number}>{timeLeft.seconds || 0}</span>
          <span className={styles.label}>GIÂY</span>
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;
