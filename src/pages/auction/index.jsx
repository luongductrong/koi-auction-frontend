import React, { useState } from 'react';
import { Layout, Input, DatePicker, Checkbox, Button, Card, Row, Col } from 'antd';
import styles from './index.module.scss';

const { RangePicker } = DatePicker;

function Auction() {
  const auctions = [
    { id: 1, title: 'Đấu giá cá lớn', date: '15/10/2024', status: 'Chưa diễn ra' },
    { id: 2, title: 'Đấu giá cá nhỏ', date: '17/10/2024', status: 'Chưa diễn ra' },
  ];

  const [stateFilter, setStateFilter] = useState([]);

  const handleToggleState = (str) => {
    const newArray = [...stateFilter];
    const index = newArray.indexOf(str);
    if (index !== -1) {
      newArray.splice(index, 1);
    } else {
      newArray.push(str);
    }
    // console.log('newArray:', newArray);
    if (newArray.length === 3 && stateFilter.length !== 4) {
      setStateFilter(['all', 'upcoming', 'ongoing', 'ended']);
      return;
    } else if (newArray.length === 3 && stateFilter.length === 4) {
      newArray.splice(0, 1);
    }
    setStateFilter(newArray);
  };

  const handleToggleAllState = () =>
    setStateFilter(stateFilter.length !== 4 ? ['all', 'upcoming', 'ongoing', 'ended'] : []);

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
          </div>
        </Col>

        <Col span={18}>
          <Row gutter={16}>
            {auctions.map((auction) => (
              <Col span={8} key={auction.id}>
                <Card title={auction.title}>
                  <p>Ngày: {auction.date}</p>
                  <p>Trạng thái: {auction.status}</p>
                  <Button type="primary">Chi Tiết</Button>
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
