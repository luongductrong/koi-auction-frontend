import React, { useState, useRef } from 'react';
import { Row, Col, Carousel, Image, Button, Modal } from 'antd';
import { PlayCircleFilled } from '@ant-design/icons';
import AuctionVideoPlayer from '../../components/AuctionVideoPlayer';
import image400x500 from '../../assets/images/400x500.svg';
import video from '../../assets/videos/7408770596160638254.mp4';
import video2 from '../../assets/videos/7378681139986304272.mp4';
import styles from './index.module.scss';

const AuctionPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoSrc, setCurrentVideoSrc] = useState(null);
  const carouselRef = useRef(null);

  const koiMedias = [
    { src: video2, alt: 'Koi 2', description: 'Koi Type 7', mediaType: 'Video' },
    { src: image400x500, alt: 'Koi 3', description: 'Koi Type 3', mediaType: 'Image Detail' },
    { src: image400x500, alt: 'Koi 4', description: 'Koi Type 4', mediaType: 'Image Detail' },
    { src: video, alt: 'Koi 6', description: 'Koi Type 6', mediaType: 'Video' },
    { src: 'https://placehold.co/400x300', alt: 'Koi 7', description: 'Koi Type 7', mediaType: 'Image Detail' },
    { src: 'https://placehold.co/400x700', alt: 'Koi 8', description: 'Koi Type 8', mediaType: 'Image Detail' },
  ];

  const handleCarouselChange = (index) => {
    setCurrentIndex(index);
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
      <Row gutter={16}>
        <Col span={10}>
          <Carousel ref={carouselRef} afterChange={handleCarouselChange} dots fade arrows>
            {koiMedias.map((media, index) => (
              <div key={index} className={styles.mediaFrame}>
                {media.mediaType === 'Image Detail' ? (
                  <Image src={media.src} alt={media.alt} width="100%" height="auto" className={styles.media} />
                ) : (
                  <div>
                    <Button
                      icon={<PlayCircleFilled style={{ fontSize: '60px', color: '#0000005c' }} />}
                      className={styles.playBtn}
                      onClick={() => openVideoModal(media.src)} // Hiển thị modal với video được chọn
                    />
                  </div>
                )}
              </div>
            ))}
          </Carousel>

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
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h1>Thông tin đấu giá Cá Koi</h1>
            <p>Mã cá Koi: K001</p>
            <p>Loại: Kohaku</p>
            <p>Tuổi: 2 năm</p>
            <p>Giá khởi điểm: 1.500.000 đ</p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AuctionPage;
