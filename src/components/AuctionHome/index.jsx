import React from 'react';
import { Row, Col, Card, Button, Typography, Space, Statistic, App, Image, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShareAltOutlined } from '@ant-design/icons';
import moment from 'moment';
import fallback from '../../assets/images/auction-image-df.jpg';
import styles from './index.module.scss';

const { Text, Title } = Typography;
const { Countdown } = Statistic;

function AuctionList({ auctions, type = 'scheduled', loading }) {
  const { message } = App.useApp();
  const { t } = useTranslation();
  const handleShare = (id) => {
    const link = `${window.location.origin}/auction/detail?id=${id}`;

    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success(t('component.home_auction.link_copied'));
      })
      .catch((err) => {
        message.error(t('component.home_auction.copy_error') + err);
      });
  };

  return (
    <div className={styles.auctionList} id={type === 'scheduled' ? 'auction' : ''}>
      <Title level={3} className={styles.header}>
        <span className={styles.before}></span>
        {type === 'scheduled' ? t('component.home_auction.scheduled') : t('component.home_auction.ongoing')}
        <span className={styles.after}></span>
      </Title>
      {((!auctions && !loading) || (auctions.length === 0 && !loading)) && (
        <Text type="secondary" className={styles.empty}>
          {type === 'scheduled' ? t('component.home_auction.no_scheduled') : t('component.home_auction.no_ongoing')}
        </Text>
      )}
      {loading && (
        <div className={styles.loading}>
          <Spin />
        </div>
      )}
      <Row gutter={[24, 16]} className={styles.auctionGrid} justify="center">
        {auctions.map((auction, index) => (
          <Col span={6} key={index}>
            <Card
              key={index}
              className={styles.auctionCard}
              cover={
                <div className={styles.cover}>
                  <Text type="secondary" strong>
                    {type === 'scheduled'
                      ? t('component.home_auction.auction_time')
                      : t('component.home_auction.time_left')}
                  </Text>
                  <Title level={5} className={styles.time}>
                    {type === 'scheduled' ? (
                      moment(auction.startTime).format('DD/MM/YYYY HH:mm:ss')
                    ) : (
                      <Countdown value={auction.endTime} format="HH:mm:ss" valueStyle={{ fontSize: '16px' }} />
                    )}
                  </Title>
                  <Image
                    alt="auction"
                    src={auction.koiInfoList?.[0]?.headerImageUrl || fallback}
                    fallback={fallback}
                    className={styles.image}
                    preview={false}
                  />
                </div>
              }
            >
              <Title level={5} className={styles.auctionId}>
                {`${t('component.home_auction.auction_number')} ${auction.auctionId}`}
              </Title>
              <Text type="secondary">
                {t('component.home_auction.starting_price')} <Text strong>{auction.startPrice?.toLocaleString()}</Text>{' '}
                VND
              </Text>
              <br />
              <Space size={20} className={styles.btnGroup}>
                <Link to={`/auction/detail?id=${auction.auctionId}`}>
                  <Button type="primary" className={styles.detailButton}>
                    {t('component.home_auction.view_details')}
                  </Button>
                </Link>
                <Button icon={<ShareAltOutlined />} shape="circle" onClick={() => handleShare(auction.auctionId)} />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
      {auctions?.length >= 4 && (
        <div className={styles.viewAll}>
          <Link to={`/auction?status=${type}&page=0&size=6&sort=desc`}>
            <Button type="primary" ghost className={styles.viewAllButton}>
              {t('component.home_auction.view_all')}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default AuctionList;
