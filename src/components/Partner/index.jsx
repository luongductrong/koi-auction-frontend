import React from 'react';
import { Carousel, Row, Col, Avatar, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';
import fallback from '../../assets/images/favicon.png';

const { Text, Title } = Typography;

const partners = [
  { name: 'Trại cá Koi A', logoUrl: '' },
  { name: 'Trại cá Koi B', logoUrl: '' },
  { name: 'Trại cá Koi C', logoUrl: '' },
  { name: 'Trại cá Koi D', logoUrl: '' },
  { name: 'Trại cá Koi E', logoUrl: '' },
  { name: 'Trại cá Koi F', logoUrl: '' },
  { name: 'Trại cá Koi G', logoUrl: '' },
  { name: 'Trại cá Koi H', logoUrl: '' },
  { name: 'Trại cá Koi I', logoUrl: '' },
];

const Partner = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <Title level={3} className={styles.header}>
          <span className={styles.before}></span>
          {t('component.partner.title')}
          <span className={styles.after}></span>
        </Title>
        <Carousel autoplay dots={{ className: styles.dots }} draggable className={styles.carousel}>
          {[0, 1].map((index) => (
            <div key={index}>
              <Row justify="center" gutter={[16, 16]}>
                {partners.slice(index * 6, index * 6 + 6).map((partner, idx) => (
                  <Col span={4} key={idx}>
                    <div className={styles.item}>
                      <Avatar shape="square" size={80} src={partner.logoUrl || fallback} />
                      <Text style={{ display: 'block', marginTop: '8px' }}>{partner.name}</Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Partner;
