import React, { useState, useEffect } from 'react';
import { Row, Col, Button, InputNumber, List, Tooltip, Card, Collapse } from 'antd';
import { Spin, Carousel, Image, Flex, Statistic, ConfigProvider, Empty, App } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import WebSocketService from '../../services/WebSocketService';
import AuctionResult from '../../components/AuctionResult';
import FloatingComment from '../../components/FloatingComment';
import api from '../../configs';
import moment from 'moment';
import 'moment/locale/vi';
import { fromNow } from '../../utils/momentCustom';
import styles from './index.module.scss';
import { commentListSample } from './temp';

const { Countdown } = Statistic;

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
  const [commentList, setCommentList] = useState(commentListSample);
  const [loading, setLoading] = useState(false);

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
        closeAcution(notification?.userId);
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

  const placeBid = async () => {
    console.log(
      'Placing bid:',
      bidAmount,
      // auctionDetails,
      currentPrice,
      auctionDetails?.buyoutPrice,
      auctionDetails?.startingPrice,
    );
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
          // setCurrentPrice(response?.data?.amount);
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

  const handleBidInputChange = (value) => {
    setBidAmount(value);
  };

  const handleCommentSubmit = (values) => {
    setCommentList((prev) => [...prev, { author: 'Bạn', content: values.comment, time: new Date() }]);
  };

  const closeAcution = (winnerId) => {
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
        <Row gutter={16}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
            <Card title={`Cuộc đấu giá ${auctionDetails?.id ? 'số ' + auctionDetails?.id : ''}`} bordered={false}>
              <div className={styles.detailsBox}>
                <strong className={`${styles.keyTitle} ${styles.startPriceTitle}`}>Giá khởi điểm:</strong>
                <p className={`${styles.value} ${styles.startPrice}`}>
                  {auctionDetails?.startingPrice?.toLocaleString()} <span style={{ fontSize: '14px' }}>VND</span>
                </p>

                <strong className={styles.keyTitle}>Bước giá:</strong>
                <p className={styles.value}>{auctionDetails?.bidStep?.toLocaleString()} VND</p>

                <strong className={styles.keyTitle}>Giá mua ngay:</strong>
                <p className={styles.value}>
                  {auctionDetails?.buyoutPrice && auctionDetails?.buyoutPrice > 0
                    ? `${auctionDetails?.buyoutPrice?.toLocaleString()} VND`
                    : 'Không có'}
                </p>

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

                <strong className={styles.keyTitle}>Thời gian trả giá còn lại:</strong>
                <div className={styles.value}>
                  {auctionDetails?.endTime && (
                    <ConfigProvider
                      theme={{
                        token: {
                          colorText: 'var(--primary-color)',
                          fontSize: '14px',
                        },
                      }}
                    >
                      <Countdown
                        value={auctionDetails.endTime || 0}
                        format={auctionDetails?.status === 'Ongoing' ? 'H giờ mm phút ss giây' : 'Đã kết thúc'}
                      />
                    </ConfigProvider>
                  )}
                </div>
              </div>
              <Flex vertical>
                <Flex vertical className={styles.currentPriceBox}>
                  <strong className={styles.currentPriceTitle}>
                    {auctionDetails?.status === 'Scheduled'
                      ? 'Giá khởi điểm'
                      : auctionDetails?.status === 'Ongoing'
                      ? 'Mức giá hiện tại'
                      : 'Mức giá cuối cùng'}
                  </strong>
                  <p className={styles.currentPriceValue}>
                    {/* {currentPrice && auctionDetails?.status === 'Ongoing' && bidHistory?.length > 0
                      ? currentPrice.toLocaleString()
                      : auctionDetails?.finalPrice &&
                        (auctionDetails?.status === 'Closed' || auctionDetails?.status === 'Finished')
                      ? auctionDetails.finalPrice.toLocaleString()
                      : auctionDetails?.startingPrice &&
                        (auctionDetails?.status !== 'Closed' || auctionDetails?.status !== 'Finished')
                      ? auctionDetails.startingPrice.toLocaleString()
                      : 0}{' '} */}
                    {currentPrice.toLocaleString()} <span style={{ fontSize: '14px' }}>VND</span>
                  </p>
                </Flex>
                {auctionDetails?.status === 'Ongoing' && (
                  <InputNumber
                    // min={currentPrice + auctionDetails?.bidStep}
                    value={bidAmount}
                    step={auctionDetails?.bidStep}
                    onChange={handleBidInputChange}
                    formatter={(value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={(value) => value.replace(/\./g, '')}
                    addonBefore="VND"
                    style={{ width: '100%', marginTop: '10px' }}
                  />
                )}
                {auctionDetails?.status === 'Ongoing' && (
                  <Button
                    type="primary"
                    onClick={placeBid}
                    style={{ width: '100%', marginTop: '10px' }}
                    disabled={
                      (bidHistory?.length > 0 && bidAmount <= currentPrice) || bidAmount < auctionDetails?.startingPrice
                    }
                  >
                    Đặt giá
                  </Button>
                )}
              </Flex>
            </Card>
            {(auctionDetails?.status === 'Finished' || auctionDetails?.status === 'Closed') && (
              <AuctionResult
                auctionId={auctionId}
                winnerId={winnerId || auctionDetails?.winnerID}
                amount={
                  // auctionDetails?.finalPrice && auctionDetails?.bidderDeposit
                  //   ? auctionDetails?.finalPrice - auctionDetails?.bidderDeposit
                  //   : null
                  currentPrice ? currentPrice - auctionDetails?.bidderDeposit : null
                }
                dealine={auctionDetails?.endTime}
              />
            )}
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
      )}
      {/* <FloatingComment commentList={commentList} onSubmit={handleCommentSubmit} /> */}
    </div>
  );
}

export default BidPage;
