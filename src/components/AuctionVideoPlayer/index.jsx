import React, { useRef, useEffect } from 'react';

const AuctionVideoPlayer = ({ src, open, onClose }) => {
  const videoRef = useRef(null);
  console.log('AuctionVideoPlayer render');

  useEffect(() => {
    if (!open && videoRef.current) {
      videoRef.current.pause(); // Dừng video khi modal đóng
      videoRef.current.currentTime = 0; // Đặt lại thời gian về đầu
    }
  }, [open]);

  const handleVideoEnd = () => {
    if (onClose) {
      onClose(); // Gọi hàm onClose để đóng modal khi video kết thúc
    }
  };

  return (
    <video ref={videoRef} width="100%" controls autoPlay muted onEnded={handleVideoEnd}>
      <source src={src} type="video/mp4" />
      Trình duyệt của bạn không hỗ trợ xem video này.
    </video>
  );
};

export default AuctionVideoPlayer;
