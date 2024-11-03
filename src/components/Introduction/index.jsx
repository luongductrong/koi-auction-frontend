import { Row, Col, Button, Typography } from 'antd';
import { Carousel } from 'antd';
import { slides } from './slides';
import styles from './index.module.scss';

const { Title, Text } = Typography;

const Intro = () => {
  return (
    <div className={styles.customLayout}>
      <Row className={styles.container}>
        <Col span={10} className={styles.leftContent}>
          <Text strong className={styles.welcome}>
            Chào mừng bạn đến với KOIAUCTION
          </Text>
          <Title level={2} className={styles.title}>
            Nền tảng đấu giá trực tuyến dành cho người yêu thích cá Koi
          </Title>
          <Text type="secondary" className={styles.intro}>
            KOIAUCTION ra đời với mục tiêu mang đến một không gian đấu giá trực tuyến tiện lợi và tin cậy cho cộng đồng
            yêu thích cá Koi. Dù là người mới tìm hiểu hay đã là người sưu tầm lâu năm, chúng tôi mong muốn tạo ra một
            trải nghiệm dễ dàng, bảo mật và thân thiện, để mọi người có thể kết nối và giao lưu thông qua những phiên
            đấu giá đầy hứng khởi.
          </Text>
          <br />
          <Button
            type="primary"
            className={styles.exploreBtn}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('auction');
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.scrollY - 120;

              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
              });
            }}
          >
            Khám Phá Ngay
          </Button>
        </Col>
        <Col span={14} className={styles.rightContent}>
          <Carousel autoplay className={styles.carousel}>
            {slides.map((slide) => (
              <div key={slide.slideId} className={styles.slide}>
                <img src={slide.url} alt={slide.alt} className={styles.img} />
              </div>
            ))}
          </Carousel>
        </Col>
      </Row>
    </div>
  );
};

export default Intro;
