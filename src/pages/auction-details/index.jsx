import React, { useState, useRef } from 'react';
import { Row, Col, Carousel, Image } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const AuctionPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const thumbnailRef = useRef(null);

  const koiImages = [
    { src: 'https://placehold.co/550x700', alt: 'Koi 1', description: 'Koi Type 1' },
    { src: 'https://placehold.co/550x800', alt: 'Koi 2', description: 'Koi Type 2' },
    { src: 'https://placehold.co/550x700', alt: 'Koi 3', description: 'Koi Type 3' },
    { src: 'https://placehold.co/550x700', alt: 'Koi 4', description: 'Koi Type 4' },
    { src: 'https://placehold.co/550x700', alt: 'Koi 5', description: 'Koi Type 5' },
    { src: 'https://placehold.co/550x700', alt: 'Koi 6', description: 'Koi Type 6' },
    { src: 'https://placehold.co/550x700', alt: 'Koi 7', description: 'Koi Type 7' },
    { src: 'https://placehold.co/550x700', alt: 'Koi 8', description: 'Koi Type 8' },
    { src: 'https://placehold.co/550x700', alt: 'Koi 9', description: 'Koi Type 9' },
    { src: 'https://placehold.co/550x700', alt: 'Koi 10', description: 'Koi Type 10' },
  ];

  const handleCarouselChange = (index) => {
    setCurrentIndex(index);
    if (thumbnailRef.current) {
      const thumbnailWidth = 90;
      const visibleThumbnails = 5;
      const scrollPosition = (index - Math.floor(visibleThumbnails / 2)) * thumbnailWidth;
      thumbnailRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    carouselRef.current.goTo(index);
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Carousel ref={carouselRef} afterChange={handleCarouselChange} dots={false}>
            {koiImages.map((image, index) => (
              <div key={index}>
                <Image src={image.src} alt={image.alt} style={{ width: '100%', height: 'auto', cursor: 'pointer' }} />
              </div>
            ))}
          </Carousel>
          <div style={{ position: 'relative', marginTop: '10px', width: '100%' }}>
            <LeftOutlined
              onClick={() => thumbnailRef.current.scrollBy({ left: -90 * 5, behavior: 'smooth' })}
              style={{
                position: 'absolute',
                top: '50%',
                left: '-20px',
                fontSize: '24px',
                cursor: 'pointer',
                zIndex: 1,
              }}
            />
            <div
              style={{
                display: 'flex',
                overflowX: 'hidden',
                whiteSpace: 'nowrap',
                width: '480px',
                padding: '0 20px',
              }}
              ref={thumbnailRef}
            >
              {koiImages.map((image, index) => (
                <Image
                  key={index}
                  width={80}
                  src={image.src}
                  alt={image.alt}
                  preview={false}
                  onClick={() => handleThumbnailClick(index)}
                  style={{
                    margin: '0 5px',
                    border: currentIndex === index ? '2px solid #1890ff' : '2px solid transparent',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
            <RightOutlined
              onClick={() => thumbnailRef.current.scrollBy({ left: 90 * 5, behavior: 'smooth' })}
              style={{
                position: 'absolute',
                top: '50%',
                right: '-20px',
                fontSize: '24px',
                cursor: 'pointer',
                zIndex: 1,
              }}
            />
          </div>
        </Col>
        <Col span={12}>
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
