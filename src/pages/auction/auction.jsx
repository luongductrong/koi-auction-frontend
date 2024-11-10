import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout, Pagination, Input, DatePicker, Checkbox, Button, Card } from 'antd';
import { Row, Col, Empty, Avatar, Select, Spin } from 'antd';
import { UserOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import Cover from '../../components/AuctionCover';
import api from '../../configs';
import styles from './index.module.scss';
import Meta from 'antd/es/card/Meta';

const { RangePicker } = DatePicker;

function Auction() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { t } = useTranslation();
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
  const [auctions, setAuctions] = useState([
    { auctionId: 0, startTime: '', status: t('page.auction.main.loading_tip') + '...' },
  ]);
  const [loading, setLoading] = useState(false);

  console.log('Child Auction render');

  useEffect(() => {
    document.title = t('page.auction.dom_title');
  }, [t]);

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
        params.append('desc', sort);

        const url = `/auction/filter?${params.toString()}`;
        console.log('URL:', url);
        window.history.pushState({}, '', url.replace('/filter', '').replace(/(^|&)desc(=|&|$)/, '$1sort$2'));

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
    setPage(0);
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
    setPage(0);
  };

  const handleToggleAllState = () => {
    const allStates = ['all'];
    if (JSON.stringify(stateFilter) !== JSON.stringify(allStates)) {
      setStateFilter(allStates);
    }
    setPage(0);
  };

  const handleToggleAllMethod = () => {
    const allMethods = ['all'];
    if (JSON.stringify(methodFilter) !== JSON.stringify(allMethods)) {
      setMethodFilter(allMethods);
    }
    setPage(0);
  };

  return (
    <Layout>
      <Row gutter={16} style={{ background: 'transparent' }}>
        <Col span={6}>
          <div className={styles.sider}>
            <h3 className={styles.siderTitle}>{t('page.auction.sidebar.search_title')}</h3>
            <Input placeholder={t('page.auction.sidebar.search_placeholder')} className={styles.searchBar} />
            <RangePicker />
            <Button type="primary" block className={styles.filterBtn}>
              {t('page.auction.sidebar.filter_button')}
            </Button>

            <h3 className={styles.siderTitle}>{t('page.auction.sidebar.status_title')}</h3>
            <Checkbox.Group className={styles.checkboxGroup} value={stateFilter}>
              <Checkbox value="all" className={styles.checkbox} onChange={() => handleToggleAllState()}>
                {t('page.auction.sidebar.status_all')}
              </Checkbox>
              <Checkbox value="scheduled" className={styles.checkbox} onChange={() => handleToggleState('scheduled')}>
                {t('page.auction.sidebar.status_scheduled')}
              </Checkbox>
              <Checkbox value="ongoing" className={styles.checkbox} onChange={() => handleToggleState('ongoing')}>
                {t('page.auction.sidebar.status_ongoing')}
              </Checkbox>
              <Checkbox value="closed" className={styles.checkbox} onChange={() => handleToggleState('closed')}>
                {t('page.auction.sidebar.status_closed')}
              </Checkbox>
            </Checkbox.Group>
            <h3 className={styles.siderTitle}> {t('page.auction.sidebar.method_title')}</h3>
            <Checkbox.Group className={styles.checkboxGroup} value={methodFilter}>
              <Checkbox value="all" className={styles.checkbox} onChange={() => handleToggleAllMethod()}>
                {t('page.auction.sidebar.method_all')}
              </Checkbox>
              <Checkbox value="ascending" className={styles.checkbox} onChange={() => handleToggleMethod('ascending')}>
                {t('page.auction.sidebar.method_ascending')}
              </Checkbox>
              <Checkbox
                value="descending"
                className={styles.checkbox}
                onChange={() => handleToggleMethod('descending')}
              >
                {t('page.auction.sidebar.method_descending')}
              </Checkbox>
              <Checkbox
                value="first-come"
                className={styles.checkbox}
                onChange={() => handleToggleMethod('first-come')}
              >
                {t('page.auction.sidebar.method_first_come')}
              </Checkbox>
              <Checkbox
                value="fixed-price"
                className={styles.checkbox}
                onChange={() => handleToggleMethod('fixed-price')}
              >
                {t('page.auction.sidebar.method_fixed_price')}
              </Checkbox>
            </Checkbox.Group>
          </div>
        </Col>

        <Col span={18} style={{ background: 'transparent' }}>
          {loading ? (
            <Spin size="large" tip={t('page.auction.main.loading_tip')} className={styles.spin}>
              <div></div>
            </Spin>
          ) : (
            <>
              {auctions?.length !== 0 && (
                <Row justify="space-between" align="middle" gutter={8} style={{ marginBottom: '16px' }}>
                  <Col>
                    <Select
                      defaultValue={sort === 'asc' ? 'oldToNew' : 'newToOld'}
                      style={{ minWidth: 80, maxWidth: 200 }}
                      onChange={(value) => {
                        setSort(value === 'oldToNew' ? 'asc' : 'desc');
                      }}
                    >
                      <Option value="oldToNew">{t('page.auction.main.sort_old_to_new')}</Option>
                      <Option value="newToOld">{t('page.auction.main.sort_new_to_old')}</Option>
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
                        <Link to={`/auction/detail?id=${auction.auctionId}`}>
                          <Button color="primary" variant="filled" style={{ width: '80%' }}>
                            {t('page.auction.main.auction_card.detail_button')}
                          </Button>
                        </Link>,
                      ]}
                    >
                      <Meta
                        title={`${t('page.auction.main.auction_card.title_prefix')}${auction.auctionId}`}
                        description={
                          <>
                            <p>
                              {`${t('page.auction.main.auction_card.start_price_label')}${' '}
                              ${auction?.startPrice?.toLocaleString()} VND`}
                            </p>
                            <p>
                              {t('page.auction.main.auction_card.status_label')}{' '}
                              {auction.status === 'Scheduled'
                                ? t('page.auction.main.auction_card.status_scheduled')
                                : auction.status === 'Ongoing'
                                ? t('page.auction.main.auction_card.status_ongoing')
                                : auction.status === 'Closed'
                                ? t('page.auction.main.auction_card.status_closed')
                                : t('page.auction.main.auction_card.status_unknown')}
                            </p>
                          </>
                        }
                      />
                    </Card>
                  </Col>
                ))}
                {auctions?.length === 0 && (
                  <Col span={24}>
                    <Empty description={t('page.auction.main.no_auctions')} style={{ paddingTop: '20vh' }} />
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
                      onShowSizeChange={(_, size) => setSize(size)}
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
