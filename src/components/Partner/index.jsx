import React, { useEffect, useState } from 'react';
import { Carousel, Row, Col, Avatar, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import api from '../../configs';
import styles from './index.module.scss';
import fallback from '../../assets/images/favicon.png';

const { Text, Title } = Typography;

const Partner = () => {
  const { t } = useTranslation();
  const [partners, setPartners] = useState([
    {
      userId: 0,
      fullName: 'KOIAUCTION',
      auctionCount: 0,
    },
  ]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await api.get('/breeder/user');
        setPartners([...response?.data, ...response?.data, ...response?.data]);
      } catch (error) {
        console.error('Failed to fetch partners:', error);
      }
    };
    fetchPartners();
  }, []);

  const shorten = (name) => {
    if (name.length > 25) {
      return name.substring(0, 25) + '...';
    }
    return name;
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <Title level={3} className={styles.header}>
          <span className={styles.before}></span>
          {t('component.partner.title')}
          <span className={styles.after}></span>
        </Title>
        <Carousel autoplay dots={{ className: styles.dots }} draggable className={styles.carousel}>
          {(partners?.length > 6 ? [0, 1] : [0]).map((index) => (
            <div key={index}>
              <Row justify="center" gutter={[16, 16]}>
                {partners.slice(index * 6, index * 6 + 6).map((partner, idx) => (
                  <Col span={4} key={idx}>
                    <div className={styles.item}>
                      <Avatar shape="square" size={80} src={fallback} />
                      <Text className={styles.fullName}>{shorten(partner.fullName)}</Text>
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
