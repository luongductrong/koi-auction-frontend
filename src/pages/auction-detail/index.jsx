import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Row, Col, Carousel, Image, Button, Modal, App, Collapse, Card, Spin, Empty, Flex, Typography } from 'antd';
import { PlayCircleFilled } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuctionVideoPlayer from '../../components/AuctionVideoPlayer';
import CountdownTimer from '../../components/CountdownTimer';
import RegisterAuctionModal from '../../components/AuctionRegisterModal';
import api from '../../configs';
import useAuth from '../../hook/useAuth';
import moment from 'moment';
import { koiOrigin } from '../../utils/koi-i8';
import fallbackImage from '../../assets/images/100x100.svg';
import poster from '../../assets/images/play-button.svg';
import image400x500 from '../../assets/images/400x500.svg';
import video from '../../assets/videos/7408770596160638254.mp4';
import video2 from '../../assets/videos/7378681139986304272.mp4';
import styles from './index.module.scss';
import warning from 'antd/es/_util/warning';

function AuctionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { onUnauthorized } = useAuth();
  const carouselRef = useRef(null);
  const { message } = App.useApp();
  const user = useSelector((state) => state.user.user);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisteredModalOpen, setIsRegisteredModalOpen] = useState(false);
  const [currentVideoSrc, setCurrentVideoSrc] = useState(null);
  const [auctionDetails, setAuctionDetails] = useState(null);
  const [koiMedias, setKoiMedias] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  // const auctionId = 1;
  // console.log('Login ', isLogin);

  useEffect(() => {
    const fetchAuctionDetails = async (auctionId) => {
      try {
        setLoading(true);

        // Sử dụng Promise.allSettled để gọi 2 API cùng lúc và xử lý độc lập
        const [auctionResponse, registerResponse] = await Promise.allSettled([
          api.get(`/auction/${auctionId}`),
          user
            ? api.get(`auction/user/check-participant-for-auction?auctionId=${auctionId}`, {
                requiresAuth: true,
                onUnauthorizedCallback: () =>
                  onUnauthorized({
                    messageText: 'Phiên đăng nhập đã hết hạn',
                    warning: true,
                    clear: true,
                  }),
              })
            : Promise.resolve({ status: 'not_fetched', value: null }),
        ]);

        // Xử lý dữ liệu từ auctionResponse
        if (auctionResponse.status === 'fulfilled') {
          setAuctionDetails(auctionResponse.value?.data || null);
          setKoiMedias(
            auctionResponse.value?.data?.koiData
              ? auctionResponse.value.data.koiData.flatMap((koi) =>
                  koi.koiMedia.map((media) => ({
                    ...media,
                    koiID: koi.id,
                    koiName: koi.koiName,
                  })),
                )
              : [],
          );
        } else {
          console.error('Failed to fetch auction details:', auctionResponse.reason);
          if (auctionResponse.reason.response && auctionResponse.reason.response.status === 404) {
            message.error('Không tìm thấy đấu giá này!');
            navigate('/auction/details/404');
          } else {
            message.error('Đã xảy ra lỗi khi tải dữ liệu!');
          }
        }
        // Xử lý dữ liệu từ registerResponse
        if (registerResponse.status === 'fulfilled') {
          setIsRegistered(registerResponse.value?.data || false);
        } else {
          console.error('Failed to fetch another API:', registerResponse.reason);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        message.error('Lỗi không xác định!');
      } finally {
        setLoading(false);
      }
    };

    const params = new URLSearchParams(location.search);
    const auctionId = params.get('id');
    if (auctionId) {
      fetchAuctionDetails(auctionId);
    } else {
      navigate('/auction/details/404');
    }
  }, [location.search]);

  const handleCarouselChange = (index) => {
    if (currentIndex !== index) {
      setCurrentIndex(index);
    }
  };

  const openVideoModal = (videoSrc) => {
    setCurrentVideoSrc(videoSrc);
    setIsModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsModalOpen(false);
    setCurrentVideoSrc(null); // Reset video source khi đóng modal
  };

  const closeRegisteredModal = () => {
    setIsRegisteredModalOpen(false);
  };

  return (
    <div>
      {loading ? (
        <Spin spinning={loading} tip="Đang tải dữ liệu..." fullscreen>
          <div></div>
        </Spin>
      ) : auctionDetails === null ? (
        <Empty description="Không có dữ liệu" className={styles.empty} />
      ) : (
        <Row gutter={16}>
          <Col span={12}>
            <Carousel ref={carouselRef} afterChange={handleCarouselChange} dots autoplay draggable>
              {koiMedias.map((media, index) => (
                <div key={index} className={styles.mediaFrame}>
                  {media.mediaType === 'Image Detail' || media.mediaType === 'Header Image' ? (
                    <Image src={media.url} alt={media.mediaType} width="100%" height="auto" className={styles.media} />
                  ) : (
                    <div>
                      <Button
                        icon={<PlayCircleFilled style={{ fontSize: '60px', color: '#0000005c' }} />}
                        className={styles.playBtn}
                        onClick={() => openVideoModal(video)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </Carousel>
            <Row className={styles.thumbnailGroup} gutter={[8, 8]}>
              {koiMedias.map((media, index) => (
                <Col span={4} key={index}>
                  <Image
                    src={
                      media?.mediaType === 'Image Detail' || media?.mediaType === 'Header Image' ? media.url : poster
                    }
                    alt={media.mediaType}
                    fallback={fallbackImage}
                    preview={false}
                    className={`${styles.thumbnail} ${currentIndex === index ? styles.activeThumbnail : ''}`}
                    onClick={() => {
                      setCurrentIndex(index);
                      carouselRef.current.goTo(index);
                    }}
                  />
                </Col>
              ))}
            </Row>

            {/* Modal for Video */}
            <Modal
              title="Video Player"
              open={isModalOpen}
              onCancel={closeVideoModal}
              footer={null}
              width="80vh"
              centered
              destroyOnClose // Unmount nội dung khi đóng modal
            >
              {currentVideoSrc && (
                <AuctionVideoPlayer src={currentVideoSrc} open={isModalOpen} onClose={closeVideoModal} />
              )}
            </Modal>
          </Col>
          <Col span={12}>
            {auctionDetails?.startTime && auctionDetails?.endTime ? (
              new Date(auctionDetails.startTime) > new Date() ? (
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
            <div className={styles.auctionDetails}>
              <h1 className={styles.auctionTitle}>Thông tin cuộc đấu giá</h1>

              <div className={styles.detailsBox}>
                <strong className={`${styles.keyTitle} ${styles.startPriceTitle}`}>Giá khởi điểm:</strong>
                <p className={`${styles.value} ${styles.startPrice}`}>
                  {auctionDetails?.startingPrice?.toLocaleString()} <span style={{ fontSize: '14px' }}>VNĐ</span>
                </p>

                <strong className={styles.keyTitle}>Mã số cuộc đấu giá:</strong>
                <p className={styles.value}>{auctionDetails?.id}</p>

                <strong className={styles.keyTitle}>Người bán:</strong>
                <p className={styles.value}>{auctionDetails?.breederFullName}</p>

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

                <strong className={styles.keyTitle}>Thời gian bắt đầu:</strong>
                <p className={styles.value}>
                  {auctionDetails?.startTime
                    ? moment(auctionDetails.startTime).format('DD/MM/YYYY, HH:mm:ss')
                    : 'Không xác định'}
                </p>

                <strong className={styles.keyTitle}>Thời gian kết thúc:</strong>
                <p className={styles.value}>
                  {auctionDetails?.endTime
                    ? moment(auctionDetails.endTime).format('DD/MM/YYYY, HH:mm:ss')
                    : 'Không xác định'}
                </p>

                <strong className={styles.keyTitle}>Tiền đặt trước:</strong>
                <p className={styles.value}>{auctionDetails?.bidderDeposit?.toLocaleString()} VNĐ</p>

                <strong className={styles.keyTitle}>Bước giá:</strong>
                <p className={styles.value}>{auctionDetails?.bidStep?.toLocaleString()} VNĐ</p>

                <strong className={styles.keyTitle}>Giá mua ngay:</strong>
                <p className={styles.value}>
                  {auctionDetails?.buyoutPrice && auctionDetails?.buyoutPrice > 0
                    ? `${auctionDetails?.buyoutPrice?.toLocaleString()} VNĐ`
                    : 'Không có'}
                </p>

                <strong className={styles.keyTitle}>Trạng thái:</strong>
                <p className={styles.value}>
                  {auctionDetails?.status === 'Ongoing'
                    ? 'Đang diễn ra'
                    : auctionDetails?.status === 'Scheduled'
                    ? 'Sắp diễn ra'
                    : auctionDetails?.status === 'Closed' || auctionDetails?.status === 'Finished'
                    ? 'Đã kết thúc'
                    : 'Không xác định'}
                </p>
              </div>

              <h2 className={styles.koiTitle}>Thông tin Cá Koi</h2>
              <Collapse
                accordion
                items={auctionDetails?.koiData.map((koi, index) => ({
                  key: index,
                  label: `${koi.koiName} (${koi.koiType})`,
                  children: (
                    <Card bordered={false}>
                      <p>
                        <strong>Nguồn gốc:</strong> {koiOrigin(koi.country)}
                      </p>
                      <p>
                        <strong>Cân nặng:</strong> {koi.weight ? `~ ${koi.weight} kg` : 'Không xác định'}
                      </p>
                      <p>
                        <strong>Chiều dài:</strong> {koi.length ? `~ ${koi.length} cm` : 'Không xác định'}
                      </p>
                      <p>
                        <strong>Giới tính:</strong>{' '}
                        {koi.sex == 'Male' ? 'Đực' : koi.sex == 'Female' ? 'Cái' : 'Không xác định'}
                      </p>
                      <p>
                        <strong>Ngày sinh:</strong>{' '}
                        {koi.birthday || koi.birthday !== 'undefined'
                          ? new Date(koi.birthday).toLocaleDateString()
                          : 'Không xác định'}
                      </p>
                      <p>
                        <strong>Mô tả:</strong> {koi.description}
                      </p>
                    </Card>
                  ),
                }))}
              />
              <Flex className={styles.registerGroup} justify="center" vertical>
                {isRegistered && auctionDetails?.status === 'Scheduled' && (
                  <Button
                    color="primary"
                    variant="filled"
                    className={styles.registerBtn}
                    onClick={() => message.info('Vui lòng chờ đến khi cuộc đấu giá bắt đầu')}
                  >
                    Đã đăng kí tham gia
                  </Button>
                )}
                {(auctionDetails?.status === 'Closed' || auctionDetails?.status === 'Finished') && (
                  <Button
                    type="primary"
                    onClick={() => navigate(`/auction/bid?id=${auctionDetails?.id}`)}
                    className={styles.registerBtn}
                  >
                    Xem kết quả đấu giá
                  </Button>
                )}
                {isRegistered && auctionDetails?.status === 'Ongoing' && (
                  <Button
                    type="primary"
                    onClick={() => navigate(`/auction/bid?id=${auctionDetails?.id}`)}
                    className={styles.registerBtn}
                  >
                    Tham gia đấu giá
                  </Button>
                )}
                {!isRegistered && (auctionDetails?.status === 'Ongoing' || auctionDetails?.status === 'Scheduled') && (
                  <Button
                    type="primary"
                    className={styles.registerBtn}
                    onClick={() => {
                      if (!user) return message.info('Vui lòng đăng nhập để tham gia đấu giá.');
                      setIsRegisteredModalOpen(true);
                    }}
                  >
                    Đăng kí tham gia đấu giá
                  </Button>
                )}
              </Flex>
            </div>
          </Col>
        </Row>
      )}
      <RegisterAuctionModal
        open={isRegisteredModalOpen}
        onClose={closeRegisteredModal}
        auctionId={auctionDetails?.id}
        depositAmount={auctionDetails?.bidderDeposit}
        setIsRegisted={setIsRegistered}
      />
    </div>
  );
}

export default AuctionPage;
