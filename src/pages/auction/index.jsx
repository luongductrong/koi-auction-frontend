import React, { useEffect, useState } from 'react';
import { Layout, Pagination, Input, DatePicker, Checkbox, Button, Card, Row, Col, Empty, Avatar, Select } from 'antd';
import { UserOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import Cover from '../../components/AuctionCover';
import api from '../../configs';
import styles from './index.module.scss';
import Meta from 'antd/es/card/Meta';

const { RangePicker } = DatePicker;

function Auction() {
  const [stateFilter, setStateFilter] = useState([]);
  const [methodFilter, setMethodFilter] = useState([]);
  const [auctions, setAuctions] = useState([{ auctionId: 0, startTime: '', status: 'Đang tải...' }]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPage: 0, totalItem: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async ({ page = 0, size = 6 } = {}) => {
    setLoading(true);
    try {
      const response = await api.get(`/auction/guest/get-all?page=${page}&size=${size}`);
      setAuctions(response.data.content);
      setPagination({
        currentPage: response.data.pageable.pageNumber,
        totalPage: response.data.totalPages,
        totalItem: response.data.totalElements,
      });
      console.log('Page', response.data.pageable.pageNumber);
      // setAuctions([]);
      console.log('Auctions:', response.data.content);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  };

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
      <Row gutter={16} style={{ background: 'transparent' }}>
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

        <Col span={18} style={{ background: 'transparent' }}>
          {auctions?.length !== 0 && (
            <Row justify="space-between" align="middle" gutter={8} style={{ marginBottom: '16px' }}>
              <Col>
                <Select defaultValue="Cũ → Mới" style={{ width: 120 }}>
                  <Option value="oldToNew">Cũ → Mới</Option>
                  <Option value="newToOld">Mới → Cũ</Option>
                </Select>
              </Col>
              <Col>
                <Button style={{ padding: '4px 8px' }}>
                  <UnorderedListOutlined onClick={() => alert('List')} />
                  {` `}
                  <AppstoreOutlined onClick={() => alert('Grid')} style={{ color: 'rgba(0,0,0,0.2)' }} />
                </Button>
              </Col>
            </Row>
          )}
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
                    title={`Cuộc đấu giá #${auction.auctionId}`}
                    description={
                      <>
                        <p>Giá khởi điểm: {auction?.startPrice?.toLocaleString()}</p>
                        <p>
                          Trạng thái:{' '}
                          {auction.status === 'Scheduled'
                            ? 'Sắp diễn ra'
                            : auction.status === 'Ongoing'
                            ? 'Đang diễn ra'
                            : auction.status === 'Closed'
                            ? 'Đã kết thúc'
                            : 'Không xác định'}
                        </p>
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
            {auctions?.length === 0 && (
              <Col span={24}>
                <Empty description="Không có cuộc đấu giá nào" style={{ paddingTop: '20vh' }} />
              </Col>
            )}
          </Row>
          {auctions?.length !== 0 && (
            <Row justify="end" align="middle" gutter={8} style={{ marginTop: '16px' }}>
              <Col>
                <Pagination
                  defaultCurrent={pagination.currentPage}
                  pageSize={6}
                  total={pagination.totalItem}
                  onChange={(page) => fetchAuctions({ page: page - 1 })}
                />
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Layout>
  );
}

export default Auction;
