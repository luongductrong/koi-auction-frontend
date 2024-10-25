import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Row, Col, Carousel, Image, Button, Modal, App, Collapse, Card, Spin, Empty, Flex } from 'antd';
import { PlayCircleFilled } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import AuctionVideoPlayer from '../../components/AuctionVideoPlayer';
import CountdownTimer from '../../components/CountdownTimer';
import api from '../../configs';
import fallbackImage from '../../assets/images/100x100.svg';
import poster from '../../assets/images/play-button.svg';
import image400x500 from '../../assets/images/400x500.svg';
import video from '../../assets/videos/7408770596160638254.mp4';
import video2 from '../../assets/videos/7378681139986304272.mp4';
import styles from './index.module.scss';

const AuctionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { Panel } = Collapse;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoSrc, setCurrentVideoSrc] = useState(null);
  const carouselRef = useRef(null);
  const [auctionDetails, setAuctionDetails] = useState(null);
  const [koiMedias, setKoiMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  // const auctionId = 1;

  const koiMedias1 = [
    { src: video2, alt: 'Koi 2', description: 'Koi Type 7', mediaType: 'Video' },
    { src: image400x500, alt: 'Koi 3', description: 'Koi Type 3', mediaType: 'Image Detail' },
    { src: image400x500, alt: 'Koi 4', description: 'Koi Type 4', mediaType: 'Image Detail' },
    { src: video, alt: 'Koi 6', description: 'Koi Type 6', mediaType: 'Video' },
    { src: 'https://placehold.co/400x300', alt: 'Koi 7', description: 'Koi Type 7', mediaType: 'Image Detail' },
    { src: 'https://placehold.co/400x700', alt: 'Koi 8', description: 'Koi Type 8', mediaType: 'Image Detail' },
  ];

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
          navigate('/auction/details/404');
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
          <Col span={10}>
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
          <Col span={14}>
            {auctionDetails?.startTime && auctionDetails?.endTime ? (
              new Date(auctionDetails.startTime) > new Date() ? (
                <CountdownTimer endTime={auctionDetails.startTime} title="Bắt đầu trả giá sau" />
              ) : (
                <CountdownTimer endTime={auctionDetails.endTime} title="Thời gian trả giá còn lại" />
              )
            ) : (
              <div>Lỗi hiển thị đồng hồ</div>
            )}
            <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <h1>Thông tin đấu giá Cá Koi</h1>
              <p>
                <strong>Mã đấu giá:</strong> {auctionDetails?.id}
              </p>
              <p>
                <strong>Người gây giống:</strong> {auctionDetails?.breederFullName}
              </p>
              <p>
                <strong>Loại đấu giá:</strong> {auctionDetails?.auctionMethod}
              </p>
              <p>
                <strong>Giá khởi điểm:</strong> {auctionDetails?.startingPrice?.toLocaleString()} đ
              </p>
              <p>
                <strong>Giá mua ngay:</strong>{' '}
                {auctionDetails?.buyoutPrice ? auctionDetails?.buyoutPrice?.toLocaleString() : 'Không có'} đ
              </p>
              <p>
                <strong>Giá cuối cùng:</strong>{' '}
                {auctionDetails?.finalPrice ? auctionDetails?.finalPrice?.toLocaleString() : 'Chưa có'} đ
              </p>
              <p>
                <strong>Phí đấu giá:</strong> {auctionDetails?.auctionFee?.toLocaleString()} đ
              </p>
              <p>
                <strong>Trạng thái:</strong> {auctionDetails?.status}
              </p>

              <h2>Thông tin Cá Koi</h2>
              <Collapse accordion>
                {auctionDetails?.koiData.map((koi, index) => (
                  <Panel header={`${koi.koiName} (${koi.koiType})`} key={index}>
                    <Card bordered={false}>
                      <p>
                        <strong>Quốc gia:</strong> {koi.country}
                      </p>
                      <p>
                        <strong>Cân nặng:</strong> {koi.weight} kg
                      </p>
                      <p>
                        <strong>Giới tính:</strong> {koi.sex}
                      </p>
                      <p>
                        <strong>Ngày sinh:</strong> {new Date(koi.birthday).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Chiều dài:</strong> {koi.length} cm
                      </p>
                      <p>
                        <strong>Mô tả:</strong> {koi.description}
                      </p>
                    </Card>
                  </Panel>
                ))}
              </Collapse>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AuctionPage;
