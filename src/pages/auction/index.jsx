import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Layout,
  Pagination,
  Input,
  DatePicker,
  Checkbox,
  Button,
  Card,
  Row,
  Col,
  Empty,
  Avatar,
  Select,
  Spin,
} from 'antd';
import { UserOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import Cover from '../../components/AuctionCover';
import api from '../../configs';
import styles from './index.module.scss';
import Meta from 'antd/es/card/Meta';

const { RangePicker } = DatePicker;

function Auction() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const states = params.getAll('status');
  const methods = params.getAll('method');
  const pageParam = params.get('page');
  const sizeParam = params.get('size');
  const sortParam = params.get('sort');

  const [stateFilter, setStateFilter] = useState(() => {
    if (states.length === 0) return ['all'];
    return states;
  });
  const [methodFilter, setMethodFilter] = useState(() => {
    if (methods.length === 0) return ['all'];
    return methods;
  });
  const [page, setPage] = useState(() => {
    const parsedPage = parseInt(pageParam);
    return Number.isNaN(parsedPage) || parsedPage < 0 ? 0 : parsedPage;
  });
  const [size, setSize] = useState(() => {
    const parsedSize = parseInt(sizeParam);
    return Number.isNaN(parsedSize) || parsedSize <= 0 ? 6 : parsedSize;
  });
  const [sort, setSort] = useState(() => (sortParam === 'asc' ? 'asc' : 'desc'));

  const [pagination, setPagination] = useState({ currentPage: page, totalPage: 0, totalItem: 0 });
  const [auctions, setAuctions] = useState([{ auctionId: 0, startTime: '', status: 'Đang tải...' }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAuctions = async ({ states = [], methods = [], page = 0, size = 6, sort = 'desc' } = {}) => {
      setLoading(true);
      try {
        // Tạo chuỗi truy vấn từ các tham số
        const params = new URLSearchParams();

        // Thêm các trạng thái vào params
        states.forEach((state) => {
          if (state === 'all') return;
          params.append('status', state);
          if (state === 'closed') params.append('status', 'finished');
        });

        // Thêm các phương thức vào params
        methods.forEach((method) => {
          if (method === 'all') return;
          params.append('method', method);
        });

        params.append('page', page);
        params.append('size', size);
        params.append('sort', sort);

        const url = `/auction/filter?${params.toString()}`;
        console.log('URL:', url);
        window.history.pushState({}, '', url.replace('/filter', ''));

        const response = await api.get(url);
        setAuctions(response.data.auctions);
        setPagination({
          currentPage: response.data.currentPage,
          totalPage: response.data.totalPages,
          totalItem: response.data.totalElements,
        });
        console.log('Res:', response.data);
        console.log('Page', response.data.currentPage);
        console.log('Auctions:', response.data.auctions);
      } catch (error) {
        console.error('Failed to fetch auctions:', error);
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions({ states: stateFilter, methods: methodFilter, page: page, size: size, sort: sort });
  }, [stateFilter, methodFilter, page, size, sort, location.search]);

  const handleToggleState = (str) => {
    const newArray = [...stateFilter];
    const index = newArray.indexOf(str);

    // Xử lý toggle chọn/bỏ chọn state
    if (index !== -1) {
      newArray.splice(index, 1); // Nếu đã có thì bỏ chọn
    } else {
      newArray.push(str); // Nếu chưa có thì chọn
    }

    // Kiểm tra xem có các phần tử trạng thái đã chọn không
    const selectedStates = ['scheduled', 'ongoing', 'closed'];
    const selectedCount = newArray.filter((state) => selectedStates.includes(state)).length;

    // Nếu chọn cả 3 trạng thái, đặt lại về 'all'
    if (selectedCount === selectedStates.length) {
      setStateFilter(['all']);
    } else {
      // Nếu có phần tử nào khác 'all', loại bỏ 'all'
      if (newArray.includes('all')) {
        newArray.splice(newArray.indexOf('all'), 1);
      }

      // Nếu không có phần tử nào được chọn, trả về 'all'
      if (newArray.length === 0) {
        setStateFilter(['all']);
      } else {
        setStateFilter(newArray);
      }
    }
  };

  const handleToggleMethod = (str) => {
    const newArray = [...methodFilter];
    const index = newArray.indexOf(str);
    if (index !== -1) {
      newArray.splice(index, 1);
    } else {
      newArray.push(str);
    }
    const selectedMethods = ['ascending', 'descending', 'first-come', 'fixed-price'];
    const selectedCount = newArray.filter((method) => selectedMethods.includes(method)).length;

    if (selectedCount === selectedMethods.length) {
      setMethodFilter(['all']);
    } else {
      if (newArray.includes('all')) {
        newArray.splice(newArray.indexOf('all'), 1);
      }
      if (newArray.length === 0) {
        setMethodFilter(['all']);
      } else {
        setMethodFilter(newArray);
      }
    }
  };

  const handleToggleAllState = () => {
    const allStates = ['all'];
    if (JSON.stringify(stateFilter) !== JSON.stringify(allStates)) {
      setStateFilter(allStates);
    }
  };

  const handleToggleAllMethod = () => {
    const allMethods = ['all'];
    if (JSON.stringify(methodFilter) !== JSON.stringify(allMethods)) {
      setMethodFilter(allMethods);
    }
  };

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
              <Checkbox value="scheduled" className={styles.checkbox} onChange={() => handleToggleState('scheduled')}>
                Sắp diễn ra
              </Checkbox>
              <Checkbox value="ongoing" className={styles.checkbox} onChange={() => handleToggleState('ongoing')}>
                Đang diễn ra
              </Checkbox>
              <Checkbox value="closed" className={styles.checkbox} onChange={() => handleToggleState('closed')}>
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
              <Checkbox
                value="first-come"
                className={styles.checkbox}
                onChange={() => handleToggleMethod('first-come')}
              >
                Trả giá một lần
              </Checkbox>
              <Checkbox
                value="fixed-price"
                className={styles.checkbox}
                onChange={() => handleToggleMethod('fixed-price')}
              >
                Giá xác định
              </Checkbox>
            </Checkbox.Group>
          </div>
        </Col>

        <Col span={18} style={{ background: 'transparent' }}>
          {loading ? (
            <Spin size="large" tip="Đang tải dữ liệu" className={styles.spin}>
              <div></div>
            </Spin>
          ) : (
            <>
              {auctions?.length !== 0 && (
                <Row justify="space-between" align="middle" gutter={8} style={{ marginBottom: '16px' }}>
                  <Col>
                    <Select
                      defaultValue={sort === 'asc' ? 'oldToNew' : 'newToOld'}
                      style={{ width: 120 }}
                      onChange={(value) => {
                        setSort(value === 'oldToNew' ? 'asc' : 'desc');
                      }}
                    >
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
                <Row
                  justify={auctions.length % 3 === 0 ? 'end' : 'center'}
                  align="middle"
                  gutter={8}
                  style={{ marginTop: '16px' }}
                >
                  <Col>
                    <Pagination
                      defaultCurrent={page + 1}
                      pageSize={size}
                      total={pagination.totalItem}
                      onChange={(page) => setPage(page - 1)}
                      showSizeChanger
                      pageSizeOptions={['6', '12', '24', '48']}
                      onShowSizeChange={(current, size) => setSize(size)}
                    />
                  </Col>
                </Row>
              )}
            </>
          )}
        </Col>
      </Row>
    </Layout>
  );
}

export default Auction;
