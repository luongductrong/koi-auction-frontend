import { Row, Col, Button, Typography } from 'antd';
import { Carousel } from 'antd';
import { useTranslation } from 'react-i18next';
import { slides } from './slides';
import styles from './index.module.scss';

const { Title, Text } = Typography;

const Intro = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.customLayout}>
      <Row className={styles.container}>
        <Col span={10} className={styles.leftContent}>
          <Text strong className={styles.welcome}>
            {t('component.intro.welcome')}
          </Text>
          <Title level={2} className={styles.title}>
            {t('component.intro.title')}
          </Title>
          <Text type="secondary" className={styles.intro}>
            {t('component.intro.description')}
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
            {t('component.intro.explore')}
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
