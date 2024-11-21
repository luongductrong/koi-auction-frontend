import React from 'react';
import { Button, Flex, App } from 'antd';
import { useNavigate } from 'react-router-dom';

const actionGroupStyle = {
  margin: '20px 0',
};

const actionBtnStyle = {
  minWidth: '100%',
  textAlign: 'center',
};

function AuctionActionButton({ auctionDetails, isRegistered, user, setIsRegisteredModalOpen }) {
  const { message } = App.useApp();
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!isRegistered && (auctionDetails.status === 'Ongoing' || auctionDetails.status === 'Scheduled')) {
      if (!user) {
        message.info('Vui lòng đăng nhập để tham gia đấu giá.');
        return;
      }
      setIsRegisteredModalOpen(true);
      return;
    }
  };

  const getButtonProps = () => {
    try {
      if (['Closed', 'Finished', 'Paid', 'Failed'].includes(auctionDetails.status)) {
        return {
          type: 'primary',
          children: 'Xem kết quả đấu giá',
          onClick: () => navigate(`/auction/bid?id=${auctionDetails.id}`),
        };
      }

      if (['Descending', 'Fixed-price'].includes(auctionDetails.auctionMethod)) {
        if (auctionDetails.status === 'Scheduled') {
          return {
            type: 'primary',
            children: 'Đấu giá chưa bắt đầu',
            onClick: () => message.info('Vui lòng chờ đến khi cuộc đấu giá bắt đầu'),
          };
        }
        if (auctionDetails.status === 'Ongoing') {
          return {
            type: 'primary',
            children: 'Tham gia đấu giá',
            onClick: () => navigate(`/auction/bid?id=${auctionDetails.id}`),
          };
        }
      }

      if (user.userId === auctionDetails.breederID) {
        if (auctionDetails.status === 'Ongoing') {
          return {
            type: 'primary',
            children: 'Xem đấu giá',
            onClick: () => navigate(`/auction/bid?id=${auctionDetails.id}`),
          };
        }
        if (auctionDetails.status === 'Scheduled') {
          return null;
        }
      }

      if (isRegistered) {
        if (auctionDetails.status === 'Ongoing') {
          return {
            type: 'primary',
            children: 'Tham gia đấu giá',
            onClick: () => navigate(`/auction/bid?id=${auctionDetails.id}`),
          };
        }
        if (auctionDetails.status === 'Scheduled') {
          return {
            type: 'primary',
            children: 'Đã đăng kí tham gia',
            onClick: () => message.info('Vui lòng chờ đến khi cuộc đấu giá bắt đầu'),
          };
        }
      }

      if (!isRegistered && (auctionDetails.status === 'Ongoing' || auctionDetails.status === 'Scheduled')) {
        return { type: 'primary', children: 'Đăng kí tham gia đấu giá', onClick: handleRegister };
      }
    } catch (error) {
      console.error('Failed to get button props:', error);
    }
    return null;
  };

  const buttonProps = getButtonProps();

  if (!buttonProps) return null;

  return (
    <Flex justify="center" vertical style={actionGroupStyle}>
      <Button {...buttonProps} style={actionBtnStyle} />
    </Flex>
  );
}

export default AuctionActionButton;
