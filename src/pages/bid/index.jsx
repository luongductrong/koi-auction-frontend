import React, { useState, useEffect } from 'react';
import { Row, Col, Button, InputNumber, List, Tooltip, Card, Collapse, Modal } from 'antd';
import { Spin, Carousel, Image, Flex, Empty, App, Divider } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import WebSocketService from '../../services/WebSocketService';
import AuctionResult from '../../components/AuctionResult';
import CountdownTimer from '../../components/CountdownTimer';
import api from '../../configs';
import moment from 'moment';
import 'moment/locale/vi';
import { fromNow } from '../../utils/momentCustom';
import styles from './index.module.scss';
import { set } from 'lodash';
import { use } from 'i18next';

function BidPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [auctionId, setAuctionId] = useState(params.get('id'));
  const [bidAmount, setBidAmount] = useState(0);
  const [auctionDetails, setAuctionDetails] = useState(null);
  const [koiMedias, setKoiMedias] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [bidHistory, setBidHistory] = useState([]);
  const [winnerId, setWinnerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  console.log('BidPage render');

  useEffect(() => {
    // Connect to WebSocket
    const displayBidUpdate = (bidUpdate) => {
      console.log('New bid:', bidUpdate);
      setCurrentPrice(bidUpdate.amount);
      setBidHistory((prev) => [
        {
          bidderId: bidUpdate.bidderId,
          fullName: bidUpdate.fullName,
          amount: bidUpdate.amount,
          bidTime: bidUpdate.bidTime,
        },
        ...prev,
      ]);
    };

    if (auctionId && auctionDetails && auctionDetails?.status === 'Ongoing') {
      WebSocketService.connect(auctionId, displayBidUpdate, (notification) => {
        console.log('New notification:', notification);
        message.info('Đấu giá đã kết thúc!');
        closeAuction(notification?.winderId);
      });
    }
    return () => {
      WebSocketService.disconnect();
    };
  }, [auctionId, auctionDetails?.status]);

  useEffect(() => {
    const fetchAuctionData = async () => {
      setLoading(true);
      try {
        const [auctionDetailsResponse, bidHistoryResponse] = await Promise.allSettled([
          api.get(`/auction/${auctionId}`),
          api.get(`/bid/get-all?auctionId=${auctionId}`, {
            requiresAuth: true,
            onUnauthorizedCallback: () => {
              message.warning('Vui lòng đăng nhập để xem lịch sử đấu giá!');
            },
          }),
        ]);

        // Fetch auction details
        if (auctionDetailsResponse.status === 'fulfilled') {
          const auctionDetailsData = auctionDetailsResponse.value?.data;
          setAuctionDetails(auctionDetailsData || null);
          setKoiMedias(
            auctionDetailsData?.koiData
              ? auctionDetailsData.koiData.flatMap((koi) =>
                  koi.koiMedia.map((media) => ({
                    ...media,
                    koiID: koi.id,
                    koiName: koi.koiName,
                  })),
                )
              : [],
          );
        } else {
          console.error('Failed to fetch auction details:', auctionDetailsResponse.reason);
          if (auctionDetailsResponse.reason.response?.status === 404) {
            message.error('Không tìm thấy đấu giá này!');
            navigate('404');
          } else {
            message.error('Đã xảy ra lỗi khi tải dữ liệu cuộc đấu giá!');
          }
        }

        // Fetch bid history
        if (bidHistoryResponse.status === 'fulfilled') {
          const bidData = bidHistoryResponse?.value?.data;
          if (bidData) {
            bidData.sort((a, b) => new Date(b.bidTime) - new Date(a.bidTime));
            setBidHistory(bidData);
          } else {
            setBidHistory([]);
          }
          setCurrentPrice(bidData?.length > 0 ? bidData[0].amount : auctionDetailsResponse?.value?.data?.startingPrice);
          console.log(
            'Bid history Curent Price:',
            bidData?.length > 0 ? bidData[0].amount : auctionDetailsResponse?.value?.data?.startingPrice,
          );
        } else {
          console.error('Failed to load auction data', bidHistoryResponse.reason);
        }
      } catch (error) {
        console.error('An error occurred while fetching auction data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (auctionId) {
      fetchAuctionData();
    } else {
      navigate('404');
    }
  }, []);

  const descendingCurrentPrice = () => {
    try {
      const { startingPrice, buyoutPrice, startTime, endTime, bidStep } = auctionDetails;
      // Sum of price range
      const priceRange = startingPrice - buyoutPrice;
      // Duration of auction
      const duration = new Date(endTime) - new Date(startTime);
      // Time for each step
      const stepTimeMillis = duration / (priceRange / bidStep);
      // Number of elapsed steps
      const elapsedSteps = Math.floor((Date.now() - new Date(startTime)) / stepTimeMillis);
      // Current price
      const currentPrice = startingPrice - elapsedSteps * bidStep;
      // Return the higher price between current price and buyout price
      console.log('Current Desc Price:', currentPrice, buyoutPrice);
      return Math.max(currentPrice, buyoutPrice);
    } catch (error) {
      console.error('Error calculating descending price:', error);
      return startingPrice; // Return starting price if error occurs
    }
  };

  useEffect(() => {
    if (auctionDetails?.status === 'Ongoing' && auctionDetails?.auctionMethod === 'Descending') {
      setCurrentPrice(descendingCurrentPrice());
      const interval = setInterval(() => {
        setCurrentPrice(descendingCurrentPrice());
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [auctionDetails]);

  const placeBid = async () => {
    console.log('Placing bid:', bidAmount, currentPrice, auctionDetails?.buyoutPrice, auctionDetails?.startingPrice);
    console.log(
      'Bid:',
      auctionDetails && auctionDetails.buyoutPrice < bidAmount,
      auctionDetails && auctionDetails.startingPrice <= bidAmount && bidAmount >= currentPrice,
    );
    if (auctionDetails && auctionDetails.buyoutPrice < bidAmount) {
      message.error('Mức giá của bạn vượt quá giá mua ngay!');
      return;
    }
    if (auctionDetails && auctionDetails.startingPrice <= bidAmount && bidAmount >= currentPrice) {
      try {
        const response = await api.post(
          'bid/place',
          { auctionId: auctionId, amount: bidAmount },
          { requiresAuth: true },
        );
        if (response) {
          message.success('Trả giá thành công!');
          console.log('Bid...CurrentPrice', response?.data?.amount);
        }
      } catch (error) {
        console.error('Failed to place bid:', error);
        message.error('Trả giá thất bại!');
      }
      setBidAmount(0);
    } else {
      message.error('Đã xảy ra lỗi!');
    }
  };

  const handleBuyout = async () => {
    try {
      const response = await api.post(`/auction/user/close-auction?auctionId=${auctionId}`, null, {
        requiresAuth: true,
        onUnauthorizedCallback: () => {
          message.error('Vui lòng đăng nhập lại để thực hiện chức năng này!');
          navigate(`/login?redirect=${location.pathname + location.search}`);
        },
      });
      if (response) {
        message.success('Mua ngay thành công!');
        console.log('Buyout...CurrentPrice', response?.data?.amount);
      }
    } catch (error) {
      console.error('Failed to place bid:', error);
      message.error('Mua ngay thất bại!');
    } finally {
      setModalOpen(false);
    }
  };

  const handleBidInputChange = (value) => {
    setBidAmount(value);
  };

  const closeAuction = (winnerId) => {
    console.log('Closing auction...CurrentPrice', currentPrice);
    setAuctionDetails(() => ({
      ...auctionDetails,
      status: 'Closed',
      endTime: new Date(),
      winnerID: winnerId,
      finalPrice: currentPrice,
    }));
  };

  return (
    <div className={styles.BidPage}>
      {loading ? (
        <Spin spinning={loading} tip="Đang tải dữ liệu..." fullscreen>
          <div></div>
        </Spin>
      ) : auctionDetails === null && !loading ? (
        <Empty description="Không có dữ liệu" className={styles.empty} />
      ) : (
        <>
          <Row gutter={16}>
            <Col span={24}>
              <Divider
                style={{
                  borderColor: '##696969',
                }}
              >
                <h2 style={{ color: '#212529', marginBottom: '32px' }}>{`Đấu giá số ${
                  auctionDetails?.id
                } - đấu giá cá Koi ${auctionDetails?.koiData?.map((koi) => koi.koiName).join(', ')}`}</h2>
              </Divider>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              {auctionDetails?.startTime && auctionDetails?.endTime ? (
                auctionDetails.status === 'Scheduled' ? (
                  <CountdownTimer
                    endTime={auctionDetails.startTime}
                    title="Bắt đầu trả giá sau"
                    status={auctionDetails.status}
                  />
                ) : (
                  <CountdownTimer
                    endTime={auctionDetails.endTime}
                    title="Thời gian trả giá còn lại"
                    status={auctionDetails.status}
                  />
                )
              ) : (
                <div>Lỗi hiển thị đồng hồ</div>
              )}
              {(auctionDetails?.status === 'Finished' || auctionDetails?.status === 'Closed') && (
                <AuctionResult
                  auctionId={auctionId}
                  winnerId={winnerId || auctionDetails?.winnerID}
                  method={auctionDetails?.auctionMethod}
                  amount={currentPrice ? currentPrice - auctionDetails?.bidderDeposit : null}
                  deadline={auctionDetails?.endTime}
                />
              )}
              <Carousel dots autoplay draggable>
                {koiMedias.map(
                  (media, index) =>
                    (media.mediaType === 'Image Detail' || media.mediaType === 'Header Image') && (
                      <div key={index} className={styles.mediaFrame}>
                        <Image
                          src={media.url}
                          alt={media.mediaType}
                          width="100%"
                          height="auto"
                          className={styles.media}
                        />
                      </div>
                    ),
                )}
              </Carousel>
              {(!koiMedias || koiMedias.length === 0) && (
                <Empty
                  style={{ marginTop: '50px' }}
                  description="Không có hình ảnh hoặc video"
                  className={styles.empty}
                />
              )}
            </Col>
            <Col span={12} style={{ marginTop: '15px' }}>
              <Card title={'Thông tin của cuộc đấu giá'} bordered={false}>
                <div className={styles.detailsBox}>
                  {auctionDetails?.auctionMethod !== 'Fixed-price' && (
                    <>
                      <strong className={`${styles.keyTitle} ${styles.startPriceTitle}`}>Giá khởi điểm:</strong>
                      <p className={`${styles.value} ${styles.startPrice}`}>
                        {auctionDetails?.startingPrice?.toLocaleString()} <span style={{ fontSize: '14px' }}>VND</span>
                      </p>
                    </>
                  )}
                  {auctionDetails.auctionMethod !== 'Fixed-price' && auctionDetails.auctionMethod !== 'First-come' && (
                    <>
                      <strong className={styles.keyTitle}>Bước giá:</strong>
                      <p className={styles.value}>{auctionDetails?.bidStep?.toLocaleString()} VND</p>
                    </>
                  )}
                  {auctionDetails?.auctionMethod !== 'Fixed-price' && (
                    <>
                      <strong className={styles.keyTitle}>
                        {auctionDetails?.auctionMethod === 'Descending' ? 'Giá thấp nhất:' : 'Giá mua ngay:'}
                      </strong>
                      <p className={styles.value}>
                        {auctionDetails?.buyoutPrice && auctionDetails?.buyoutPrice > 0
                          ? `${auctionDetails?.buyoutPrice?.toLocaleString()} VND`
                          : 'Không có'}
                      </p>
                    </>
                  )}

                  <strong className={styles.keyTitle}>Phương thức đấu giá:</strong>
                  <p className={styles.value}>
                    {auctionDetails?.auctionMethod === 'Ascending'
                      ? 'Trả giá lên'
                      : auctionDetails?.auctionMethod === 'Descending'
                      ? 'Đặt giá xuống'
                      : auctionDetails?.auctionMethod === 'Fixed-price'
                      ? 'Giá cố định'
                      : auctionDetails?.auctionMethod === 'First-come'
                      ? 'Trả giá một lần'
                      : 'Không xác định'}
                  </p>
                </div>
                <Flex vertical>
                  {(auctionDetails?.auctionMethod === 'Ascending' ||
                    auctionDetails?.auctionMethod === 'Descending') && (
                    <Flex vertical className={styles.currentPriceBox}>
                      <strong className={styles.currentPriceTitle}>
                        {auctionDetails?.status === 'Scheduled'
                          ? 'Giá khởi điểm'
                          : auctionDetails?.status === 'Ongoing'
                          ? 'Mức giá hiện tại'
                          : 'Mức giá cuối cùng'}
                      </strong>
                      <p className={styles.currentPriceValue}>
                        {currentPrice.toLocaleString()} <span style={{ fontSize: '14px' }}>VND</span>
                      </p>
                    </Flex>
                  )}
                  {auctionDetails?.auctionMethod === 'Fixed-price' && (
                    <Flex vertical className={styles.currentPriceBox}>
                      <strong className={styles.currentPriceTitle}>Giá niêm yết</strong>
                      <p className={styles.currentPriceValue}>
                        {auctionDetails?.buyoutPrice.toLocaleString()} <span style={{ fontSize: '14px' }}>VND</span>
                      </p>
                    </Flex>
                  )}
                  {auctionDetails?.auctionMethod === 'First-come' &&
                    (auctionDetails?.status === 'Scheduled' || auctionDetails?.status === 'Ongoing') && (
                      <Flex vertical className={styles.currentPriceBox}>
                        <strong className={styles.currentPriceTitle}>Giá khởi điểm</strong>
                        <p className={styles.currentPriceValue}>
                          {auctionDetails?.startingPrice.toLocaleString()} <span style={{ fontSize: '14px' }}>VND</span>
                        </p>
                      </Flex>
                    )}
                  {auctionDetails?.auctionMethod === 'First-come' &&
                    auctionDetails?.status !== 'Scheduled' &&
                    auctionDetails?.status !== 'Ongoing' && (
                      <Flex vertical className={styles.currentPriceBox}>
                        <strong className={styles.currentPriceTitle}>Mức giá cuối cùng</strong>
                        <p className={styles.currentPriceValue}>
                          {auctionDetails?.startingPrice.toLocaleString()} <span style={{ fontSize: '14px' }}>VND</span>
                        </p>
                      </Flex>
                    )}
                  {auctionDetails?.status === 'Ongoing' &&
                    (auctionDetails?.auctionMethod === 'Ascending' ||
                      auctionDetails?.auctionMethod === 'First-come') && (
                      <InputNumber
                        value={bidAmount}
                        step={auctionDetails?.bidStep}
                        onChange={handleBidInputChange}
                        formatter={(value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        parser={(value) => value.replace(/\./g, '')}
                        addonBefore="VND"
                        style={{ width: '100%', marginTop: '10px' }}
                      />
                    )}
                  {auctionDetails?.status === 'Ongoing' &&
                    (auctionDetails?.auctionMethod === 'Ascending' ||
                      auctionDetails?.auctionMethod === 'First-come') && (
                      <Button
                        type="primary"
                        onClick={placeBid}
                        style={{ width: '100%', marginTop: '10px' }}
                        disabled={
                          (bidHistory?.length > 0 && bidAmount <= currentPrice) ||
                          bidAmount < auctionDetails?.startingPrice
                        }
                      >
                        Đặt giá
                      </Button>
                    )}
                  {auctionDetails?.status === 'Ongoing' && (
                    <Button
                      type="primary"
                      ghost
                      style={{ width: '100%', marginTop: '10px' }}
                      onClick={() => setModalOpen(true)}
                    >
                      Mua ngay
                    </Button>
                  )}
                </Flex>
              </Card>
              <Collapse
                className={styles.bidHistory}
                items={[
                  {
                    key: '1',
                    label: 'Lịch sử trả giá',
                    children: (
                      <List
                        itemLayout="horizontal"
                        dataSource={bidHistory}
                        className={styles.list}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              title={<span>{item.fullName}</span>}
                              description={`Giá: ${item.amount.toLocaleString()} VND`}
                            />
                            <Tooltip title={moment(item.bidTime).format('DD/MM/YYYY HH:mm:ss')}>
                              <span>{fromNow(item.bidTime)}</span>
                            </Tooltip>
                          </List.Item>
                        )}
                      />
                    ),
                  },
                ]}
                accordion
                defaultActiveKey={['1']}
              />
              {/* end of Collapse /--------------------------------------------------/ */}
            </Col>
          </Row>
          <Modal
            title={'Xác nhận mua ngay'}
            open={modalOpen}
            onOk={() => handleBuyout()}
            onCancel={() => setModalOpen(false)}
          >
            <span>{`Xác định mua ngay với giá ${
              auctionDetails.auctionMethod === 'Descending'
                ? descendingCurrentPrice().toLocaleString()
                : auctionDetails?.buyoutPrice
                ? auctionDetails?.buyoutPrice.toLocaleString()
                : 0
            } VND?`}</span>
          </Modal>
        </>
      )}
    </div>
  );
}

export default BidPage;
