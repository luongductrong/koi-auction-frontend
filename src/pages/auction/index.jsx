import React, { useEffect, useState } from 'react';
import { Layout, Input, DatePicker, Checkbox, Button, Card, Row, Col, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Cover from '../../components/AuctionCover';
import api from '../../configs';
import styles from './index.module.scss';
import Meta from 'antd/es/card/Meta';

const { RangePicker } = DatePicker;

function Auction() {
  const [stateFilter, setStateFilter] = useState([]);
  const [methodFilter, setMethodFilter] = useState([]);
  const [auctions, setAuctions] = useState([{ auctionId: 0, startTime: '', status: 'Đang tải...' }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      try {
        const response = await api.get('/auction/guest/get-all?page=1&size=6');
        setAuctions(response.data.content);
        console.log('Auctions:', response.data.content);
      } catch (error) {
        console.error('Failed to fetch auctions:', error);
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const handleToggleState = (str) => {
    const newArray = [...stateFilter];
    const index = newArray.indexOf(str);
    if (index !== -1) {
      newArray.splice(index, 1);
    } else {
      newArray.push(str);
    }

    if (newArray.length === 3 && stateFilter.length !== 4) {
      setStateFilter(['all', 'upcoming', 'ongoing', 'ended']);
      return;
    } else if (newArray.length === 3 && stateFilter.length === 4) {
      newArray.splice(0, 1);
    }
    setStateFilter(newArray);
  };

  const handleToggleMethod = (str) => {
    const newArray = [...methodFilter];
    const index = newArray.indexOf(str);
    if (index !== -1) {
      newArray.splice(index, 1);
    } else {
      newArray.push(str);
    }

    if (newArray.length === 4 && methodFilter.length !== 5) {
      setMethodFilter(['all', 'ascending', 'descending', '1time', 'fixed']);
      return;
    } else if (newArray.length === 4 && methodFilter.length === 5) {
      newArray.splice(0, 1);
    }
    setMethodFilter(newArray);
  };

  const handleToggleAllState = () =>
    setStateFilter(stateFilter.length !== 4 ? ['all', 'upcoming', 'ongoing', 'ended'] : []);

  const handleToggleAllMethod = () =>
    setMethodFilter(methodFilter.length !== 5 ? ['all', 'ascending', 'descending', '1time', 'fixed'] : []);

  return (
    <Layout>
      <Row gutter={16}>
        <Col span={6}>
          <div className={styles.sider}>
            <h3 className={styles.siderTitle}>Tìm kiếm</h3>
            <Input placeholder="Nhập từ khóa..." className={styles.searchBar} />
            <RangePicker />
            <Button type="primary" block className={styles.filterBtn}>
              Lọc
            </Button>

            <h3 className={styles.siderTitle}>Trạng thái</h3>
            <Checkbox.Group className={styles.checkboxGroup} value={stateFilter}>
              <Checkbox value="all" className={styles.checkbox} onChange={() => handleToggleAllState()}>
                Tất cả
              </Checkbox>
              <Checkbox value="upcoming" className={styles.checkbox} onChange={() => handleToggleState('upcoming')}>
                Sắp diễn ra
              </Checkbox>
              <Checkbox value="ongoing" className={styles.checkbox} onChange={() => handleToggleState('ongoing')}>
                Đang diễn ra
              </Checkbox>
              <Checkbox value="ended" className={styles.checkbox} onChange={() => handleToggleState('ended')}>
                Đã kết thúc
              </Checkbox>
            </Checkbox.Group>
            <h3 className={styles.siderTitle}>Phương thức</h3>
            <Checkbox.Group className={styles.checkboxGroup} value={methodFilter}>
              <Checkbox value="all" className={styles.checkbox} onChange={() => handleToggleAllMethod()}>
                Tất cả
              </Checkbox>
              <Checkbox value="ascending" className={styles.checkbox} onChange={() => handleToggleMethod('ascending')}>
                Trả giá lên
              </Checkbox>
              <Checkbox
                value="descending"
                className={styles.checkbox}
                onChange={() => handleToggleMethod('descending')}
              >
                Đặt giá xuống
              </Checkbox>
              <Checkbox value="1time" className={styles.checkbox} onChange={() => handleToggleMethod('1time')}>
                Trả giá một lần
              </Checkbox>
              <Checkbox value="fixed" className={styles.checkbox} onChange={() => handleToggleMethod('fixed')}>
                Giá xác định
              </Checkbox>
            </Checkbox.Group>
          </div>
        </Col>

        <Col span={18}>
          <Row gutter={[16, 16]}>
            {auctions.map((auction) => (
              <Col span={8} key={auction.auctionId}>
                <Card
                  key={auction.auctionId}
                  hoverable
                  loading={loading}
                  cover={<Cover imageSrc="https://placehold.co/600x400" startTime={auction.startTime} />}
                  actions={[
                    <Button color="primary" variant="filled" style={{ width: '80%' }}>
                      Chi Tiết
                    </Button>,
                  ]}
                >
                  <Meta
                    title={'Cuộc đấu giá'}
                    description={
                      <>
                        <p>Giá khởi điểm: {auction.startPrice}</p>
                        <p>Trạng thái: {auction.status === 'Pending' ? 'Sắp diễn ra' : auction.status}</p>
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Layout>
  );
}

export default Auction;
