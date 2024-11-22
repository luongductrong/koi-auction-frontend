import React, { useState, useEffect } from 'react';
import { InputNumber, Button, Modal, App } from 'antd';
import api from '../../configs';

const style = { width: '100%', marginTop: '10px', fontWeight: '500' };

function BidGroup({ user, auctionDetails, currentPrice = 0, onBuyoutCompleted, isFirstComeBided = false }) {
  const { message } = App.useApp();
  const [bidAmount, setBidAmount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [showBidConfirm, setShowBidConfirm] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const checkIsRegistered = async () => {
      try {
        if (!auctionDetails || auctionDetails.status !== 'Ongoing') return;
        if (auctionDetails.auctionMethod === 'Descending' || auctionDetails.auctionMethod === 'Fixed-price') {
          setIsRegistered(true);
          return;
        }
        if (!user || user.userId === auctionDetails.breederID) return;
        const response = await api.get(`auction/user/check-participant-for-auction?auctionId=${auctionDetails.id}`, {
          requiresAuth: true,
        });
        setIsRegistered(response.data || false);
      } catch (error) {
        console.error('Failed to check if user is registered:', error);
      }
    };
    checkIsRegistered();
  }, [user, auctionDetails]);

  const handleBidInputChange = (value) => {
    setBidAmount(value || 0);
  };

  const bid = async () => {
    try {
      const response = await api.post(
        '/bid/place',
        { auctionId: auctionDetails.id, amount: bidAmount },
        { requiresAuth: true },
      );
      if (response) {
        message.success('Trả giá thành công!');
      }
    } catch (error) {
      console.error('Failed to place bid:', error);
      message.error('Trả giá thất bại!');
    }
    setBidAmount(null);
    setShowBidConfirm(false);
  };

  const placeBid = async () => {
    if (!bidAmount) return;

    if (auctionDetails.buyoutPrice < bidAmount) {
      message.error('Mức giá của bạn vượt quá giá mua ngay!');
      return;
    }

    if (auctionDetails.startingPrice <= bidAmount && bidAmount >= currentPrice) {
      setShowBidConfirm(true);
    } else {
      message.error('Đã xảy ra lỗi!');
    }
  };

  const handleBuyout = async () => {
    try {
      const response = await api.post(`/auction/user/close-auction?auctionId=${auctionDetails.id}`, null, {
        requiresAuth: true,
      });
      if (response) {
        message.success('Mua ngay thành công!');
        onBuyoutCompleted(user?.userId);
      }
    } catch (error) {
      console.error('Failed to buyout:', error);
      message.error('Mua ngay thất bại!');
    } finally {
      setModalOpen(false);
    }
  };

  const showBidInput =
    isRegistered &&
    auctionDetails.status === 'Ongoing' &&
    (auctionDetails.auctionMethod === 'Ascending' || auctionDetails.auctionMethod === 'First-come');
  const showBidButton = showBidInput;
  const showBuyNowButton = isRegistered && auctionDetails.status === 'Ongoing';

  if (isFirstComeBided)
    return (
      <Button type="primary" disabled>
        Đã đặt giá
      </Button>
    );

  return (
    <div>
      {showBidInput && (
        <InputNumber
          value={bidAmount}
          step={auctionDetails.bidStep}
          onChange={handleBidInputChange}
          formatter={(value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
          parser={(value) => value.replace(/\./g, '')}
          addonBefore="VND"
          style={style}
        />
      )}
      {showBidButton && (
        <Button
          type="primary"
          onClick={placeBid}
          disabled={!bidAmount || bidAmount <= currentPrice || bidAmount < auctionDetails.startingPrice}
          style={style}
        >
          Đặt giá
        </Button>
      )}
      {showBuyNowButton && (
        <Button type="primary" ghost style={style} onClick={() => setModalOpen(true)}>
          Mua ngay
        </Button>
      )}
      <Modal title="Xác nhận mua ngay" open={modalOpen} onOk={handleBuyout} onCancel={() => setModalOpen(false)}>
        <p>{`Xác nhận mua ngay`}</p>
      </Modal>
      <Modal title="Xác nhận đặt giá" open={showBidConfirm} onOk={bid} onCancel={() => setShowBidConfirm(false)}>
        <p>{`Bạn chắc chắn muốn đặt giá?`}</p>
      </Modal>
    </div>
  );
}

export default BidGroup;
