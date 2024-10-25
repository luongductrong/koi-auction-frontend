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
} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import FloatingComment from '../../components/FloatingComment';
import api from '../../configs';
import moment from 'moment';
import 'moment/locale/vi';
import styles from './index.module.scss';

const commentListSample = [
  {
    author: 'Nguyễn Văn A',
    content: 'Bài viết rất hay! Cảm ơn bạn đã chia sẻ.',
  },
  {
    author: 'Trần Thị B',
    content: 'Mình rất thích nội dung này! Có thể chia sẻ thêm thông tin không?',
  },
  {
    author: 'Lê Văn C',
    content: 'Rất hữu ích! Hy vọng có thể học hỏi thêm từ bạn.',
  },
  {
    author: 'Phạm Thị D',
    content: 'Có một số điểm cần cải thiện, nhưng nhìn chung là tốt.',
  },
  {
    author: 'Nguyễn Văn E',
    content: 'Cảm ơn bạn, mình sẽ thử áp dụng!',
  },
  {
    author: 'Trần Văn F',
    content: 'Bài viết này đã giúp mình rất nhiều, cảm ơn!',
  },
  {
    author: 'Nguyễn Văn A',
    content: 'Bài viết rất hay! Cảm ơn bạn đã chia sẻ.',
  },
  {
    author: 'Trần Thị B',
    content: 'Mình rất thích nội dung này! Có thể chia sẻ thêm thông tin không?',
  },
  {
    author: 'Lê Văn C',
    content: 'Rất hữu ích! Hy vọng có thể học hỏi thêm từ bạn.',
  },
  {
    author: 'Phạm Thị D',
    content: 'Có một số điểm cần cải thiện, nhưng nhìn chung là tốt.',
  },
  {
    author: 'Nguyễn Văn E',
    content: 'Cảm ơn bạn, mình sẽ thử áp dụng!',
  },
  {
    author: 'Trần Văn F',
    content: 'Bài viết này đã giúp mình rất nhiều, cảm ơn!',
  },
];

const { Panel } = Collapse;
const { Countdown } = Statistic;

function BidPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bidAmount, setBidAmount] = useState(0);
  const [auctionDetails, setAuctionDetails] = useState(null);
  const [koiMedias, setKoiMedias] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(1000000); // Example starting price
  const [bidHistory, setBidHistory] = useState([]);
  const [commentList, setCommentList] = useState(commentListSample);
  const [loading, setLoading] = useState(true);

  console.log('BidPage render');
  console.log(moment.locale());

  useEffect(() => {
    moment.locale('vi');
  }, []);

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

    const params = new URLSearchParams(location.search);
    const auctionId = params.get('id');
    if (auctionId) {
      fetchAuctionDetails(auctionId);
    } else {
      navigate('404');
    }
  }, [location.search]);

  //   useEffect(() => {
  //     // Fetch bid history and comments here
  //     const fetchAuctionData = async () => {
  //       setLoading(true);
  //       try {
  //         const bidResponse = await api.get('/auction/bid-history'); // Example endpoint
  //         setBidHistory(bidResponse.data);

  //         const commentResponse = await api.get('/auction/comments'); // Example endpoint
  //         setCommentList(commentResponse.data);
  //       } catch (error) {
  //         console.error('Failed to load auction data', error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchAuctionData();
  //   }, []);

  const placeBid = () => {
    if (bidAmount > currentPrice) {
      setCurrentPrice(bidAmount);
      setBidHistory((prev) => [...prev, { bidder: 'Bạn', amount: bidAmount, time: new Date() }]);
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
                      <Countdown value={auctionDetails.endTime} format="DD ngày HH:mm:ss" />
                    </ConfigProvider>
                  )}
                </div>
              </div>
              <Flex vertical>
                <Flex vertical className={styles.currentPriceBox}>
                  <strong className={styles.currentPriceTitle}>Mức giá hiện tại</strong>
                  <p className={styles.currentPriceValue}>
                    {currentPrice.toLocaleString()} <span style={{ fontSize: '14px' }}>VNĐ</span>
                  </p>
                </Flex>
                <InputNumber
                  min={currentPrice + 500000}
                  value={bidAmount}
                  step={auctionDetails?.bidStep}
                  onChange={handleBidInputChange}
                  addonBefore="VNĐ"
                  style={{ width: '100%', marginTop: '10px' }}
                />
                <Button
                  type="primary"
                  onClick={placeBid}
                  style={{ width: '100%', marginTop: '10px' }}
                  disabled={bidAmount <= currentPrice}
                >
                  Đặt giá
                </Button>
              </Flex>
            </Card>
            <Collapse className={styles.bidHistory} accordion defaultActiveKey={['1']}>
              <Panel header="Lịch sử trả giá" key="1">
                <List
                  itemLayout="horizontal"
                  dataSource={bidHistory}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={<span>{item.bidder}</span>}
                        description={`Giá: ${item.amount.toLocaleString()} VNĐ`}
                      />
                      <Tooltip title={moment(item.time).format('DD/MM/YYYY HH:mm:ss')}>
                        <span>{moment(item.time).locale('vi').fromNow()}</span>
                      </Tooltip>
                    </List.Item>
                  )}
                />
              </Panel>
            </Collapse>
          </Col>
        </Row>
      )}
      <FloatingComment commentList={commentList} onSubmit={handleCommentSubmit} />
    </div>
  );
}

export default BidPage;
