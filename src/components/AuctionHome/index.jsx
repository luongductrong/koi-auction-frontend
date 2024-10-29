import React from 'react';
import { Row, Col, Card, Button, Typography, Space, Statistic, App, Image } from 'antd';
import { Link } from 'react-router-dom';
import { ShareAltOutlined } from '@ant-design/icons';
import moment from 'moment';
import fallback from '../../assets/images/auction-image-df.jpg';
import styles from './index.module.scss';

const { Text, Title } = Typography;
const { Countdown } = Statistic;

function AuctionList({ auctions, type = 'scheduled' }) {
  const { message } = App.useApp();
  const handleShare = (id) => {
    const link = `${window.location.origin}/auction/detail?id=${id}`;

    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success('Liên kết đã được sao chép!');
      })
      .catch((err) => {
        message.error('Không thể sao chép: ' + err);
      });
  };

  return (
    <div className={styles.auctionList} id={type === 'scheduled' ? 'auction' : ''}>
      <Title level={3} className={styles.header}>
        <span className={styles.before}></span>
        {type === 'scheduled' ? 'Cuộc đấu giá sắp diễn ra' : 'Cuộc đấu giá đang diễn ra'}
        <span className={styles.after}></span>
      </Title>
      <Row gutter={[24, 16]} className={styles.auctionGrid} justify="center">
        {auctions.map((auction, index) => (
          <Col span={6} key={index}>
            <Card
              key={index}
              className={styles.auctionCard}
              cover={
                <div className={styles.cover}>
                  <Text type="secondary" strong>
                    {type === 'scheduled' ? 'Thời gian đấu giá' : 'Thời gian còn lại'}
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
              <Title level={5} className={styles.auctionId}>{`Đấu giá số ${auction.auctionId}`}</Title>
              <Text type="secondary">
                Giá khởi điểm: <Text strong>{auction.startPrice?.toLocaleString()}</Text> VND
              </Text>
              <br />
              <Space size={20} className={styles.btnGroup}>
                <Link to={`/auction/detail?id=${auction.auctionId}`}>
                  <Button type="primary" className={styles.detailButton}>
                    Xem chi tiết
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
              Xem tất cả
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default AuctionList;
