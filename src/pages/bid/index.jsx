import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Button,
  InputNumber,
  List,
  Tooltip,
  Card,
  Collapse,
  Spin,
  Carousel,
  Image,
  Flex,
  Statistic,
  ConfigProvider,
  Empty,
  App,
} from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import WebSocketService from '../../services/WebSocketService';
import FloatingComment from '../../components/FloatingComment';
import api from '../../configs';
import moment from 'moment';
import 'moment/locale/vi';
import styles from './index.module.scss';
import { commentListSample } from './temp';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const { Panel } = Collapse;
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
  const [commentList, setCommentList] = useState(commentListSample);
  const [loading, setLoading] = useState(true);

  console.log('BidPage render');
  console.log(moment.locale());

  useEffect(() => {
    moment.locale('vi');
  }, []);

  useEffect(() => {
    const displayBidUpdate = (bidUpdate) => {
      console.log('New bid:', bidUpdate);
      setCurrentPrice(bidUpdate.amount);
      setBidHistory((prev) => [
        ...prev,
        {
          bidder: bidUpdate.bidderId,
          bidderName: bidUpdate.fullName,
          amount: bidUpdate.amount,
          time: new Date(bidUpdate.bidTime).toLocaleString(),
        },
      ]);
    };

    if (auctionId) {
      WebSocketService.connect(auctionId, displayBidUpdate, (notification) => {
        console.log('New notification:', notification);
      });
    }
    return () => {
      WebSocketService.disconnect();
    };
  }, [auctionId]);

  // useEffect(() => {
  //   function connectWebSocket(auctionId) {
  //     const socket = new SockJS('http://localhost:8080/ws'); // URL endpoint của WebSocket
  //     const stompClient = Stomp.over(() => socket);

  //     stompClient.connect({}, function (frame) {
  //       console.log('Connected to WebSocket: ' + frame);
  //     });
  //   }

  //   connectWebSocket(auctionId);
  // }, []);

  useEffect(() => {
    const fetchAuctionDetails = async (auctionId) => {
      try {
        setLoading(true);
        const response = await api.get(`/auction/${auctionId}`);
        setAuctionDetails(response?.data ? response.data : null);
        setKoiMedias(
          response?.data?.koiData
            ? response.data.koiData.flatMap((koi) =>
                koi.koiMedia.map((media) => ({
                  ...media,
                  koiID: koi.id,
                  koiName: koi.koiName,
                })),
              )
            : [],
        );
        console.log(response?.data?.koiData?.flatMap((koi) => koi.koiMedia));
      } catch (error) {
        console.error('Failed to fetch auction details:', error);
        if (error.response && error.response.status === 404) {
          message.error('Không tìm thấy đấu giá này!');
          navigate('404');
        } else {
          message.error('Đã xảy ra lỗi khi tải dữ liệu!');
        }
      } finally {
        setLoading(false);
      }
    };
    if (auctionId) {
      fetchAuctionDetails(auctionId);
    } else {
      navigate('404');
    }
  }, [location.search, auctionId]);

  useEffect(() => {
    // Fetch bid history and comments here
    const fetchAuctionData = async () => {
      setLoading(true);
      try {
        const bidResponse = await api.get(`/bid/get-all?auctionId=${auctionId}`, {
          requiresAuth: true,
          onUnauthorizedCallback: () => {
            navigate('/login');
          },
        });
        const bidData = bidResponse.data;
        bidData.sort((a, b) => new Date(b.bidTime) - new Date(a.bidTime));
        setBidHistory(bidData);
        setCurrentPrice(bidData[0]?.amount ? bidData[0].amount : auctionDetails?.startingPrice);
        // const commentResponse = await api.get('/auction/comments'); // Example endpoint
        // setCommentList(commentResponse.data);
      } catch (error) {
        console.error('Failed to load auction data', error);
        message.error('Đã xảy ra lỗi khi tải lịch sử trả giá!');
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionData();
  }, []);

  const placeBid = async () => {
    if (bidAmount > currentPrice) {
      try {
        const response = await api.post(
          'bid/place',
          { auctionId: auctionId, amount: bidAmount },
          { requiresAuth: true },
        );
        if (response) {
          message.success('Trả giá thành công!');
          setCurrentPrice(response?.data?.amount);
          // setAuctionId(response?.data?.id?.auctionID ? response.data.id.auctionID : auctionId);
        }
      } catch (error) {
        console.error('Failed to place bid:', error);
        message.error('Trả giá thất bại!');
      }
      // setCurrentPrice(bidAmount);
      // setBidHistory((prev) => [...prev, { bidderName: 'Bạn', amount: bidAmount, time: new Date() }]);
      setBidAmount(0); // Reset bid input
    }
  };

  const handleBidInputChange = (value) => {
    setBidAmount(value);
  };

  const handleCommentSubmit = (values) => {
    setCommentList((prev) => [...prev, { author: 'Bạn', content: values.comment, time: new Date() }]);
  };

  return (
    <div className={styles.BidPage}>
      {loading ? (
        <Spin spinning={loading} tip="Đang tải dữ liệu..." fullscreen>
          <div></div>
        </Spin>
      ) : auctionDetails === null ? (
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
                  {auctionDetails?.startingPrice?.toLocaleString()} <span style={{ fontSize: '14px' }}>VNĐ</span>
                </p>

                <strong className={styles.keyTitle}>Bước giá:</strong>
                <p className={styles.value}>{auctionDetails?.bidStep?.toLocaleString()} VNĐ</p>

                <strong className={styles.keyTitle}>Giá mua ngay:</strong>
                <p className={styles.value}>
                  {auctionDetails?.buyoutPrice && auctionDetails?.buyoutPrice > 0
                    ? `${auctionDetails?.buyoutPrice?.toLocaleString()} VNĐ`
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
                      <Countdown value={auctionDetails.endTime} format="D ngày HH:mm:ss" />
                    </ConfigProvider>
                  )}
                </div>
              </div>
              <Flex vertical>
                <Flex vertical className={styles.currentPriceBox}>
                  <strong className={styles.currentPriceTitle}>Mức giá hiện tại</strong>
                  <p className={styles.currentPriceValue}>
                    {currentPrice?.toLocaleString()} <span style={{ fontSize: '14px' }}>VNĐ</span>
                  </p>
                </Flex>
                <InputNumber
                  // min={currentPrice + auctionDetails?.bidStep}
                  value={bidAmount}
                  step={auctionDetails?.bidStep}
                  onChange={handleBidInputChange}
                  formatter={(value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  parser={(value) => value.replace(/\./g, '')}
                  addonBefore="VNĐ"
                  style={{ width: '100%', marginTop: '10px' }}
                />
                <Button
                  type="primary"
                  onClick={placeBid}
                  style={{ width: '100%', marginTop: '10px' }}
                  disabled={bidAmount < currentPrice}
                >
                  Đặt giá
                </Button>
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
                            description={`Giá: ${item.amount.toLocaleString()} VNĐ`}
                          />
                          <Tooltip title={moment(item.bidTime).format('DD/MM/YYYY HH:mm:ss')}>
                            <span>{moment(item.bidTime).locale('vi').fromNow()}</span>
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
      <FloatingComment commentList={commentList} onSubmit={handleCommentSubmit} />
    </div>
  );
}

export default BidPage;
