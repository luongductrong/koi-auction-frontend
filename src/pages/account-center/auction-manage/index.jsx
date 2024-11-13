import React, { useEffect, useState } from 'react';
import { Table, Button, App, Pagination } from 'antd';
import api from '../../../configs';
import useAuth from '../../../hook/useAuth';
import AuctionForm from '../../../components/AuctionForm';
import styles from './auction.module.scss';

const AuctionManage = () => {
  const { message } = App.useApp();
  const { onUnauthorized } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [auctionData, setAuctionData] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 0, totalPage: 0, totalItem: 0 });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [auctionId, setAuctionId] = useState(null);
  const [drawerMode, setDrawerMode] = useState('create');
  const [loading, setLoading] = useState(false);
  const [onSuccess, setOnSuccess] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/auction/breeder?page=${page}&size=${size}&desc=DESC`, {
          requiresAuth: true,
          onUnauthorizedCallback: () =>
            onUnauthorized({
              error: true,
              messageText: 'Phiên đăng nhập đã hết hạn!',
              clear: true,
              navigation: true,
            }),
        });
        if (response?.data?.auctions) {
          console.log('Auction:', response.data.auctions);
          setAuctionData(response.data.auctions);
          setPagination({
            currentPage: response.data.currentPage,
            totalPage: response.data.totalPages,
            totalItem: response.data.totalElements,
          });
        } else {
          throw new Error("Can't get auction data");
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setAuctionData([]);
          console.log('404 fetch auction data');
          message.info('Không có cuộc đấu giá nào!');
        } else {
          console.error('Failed to fetch data:', error);
          message.error('Lỗi khi tải dữ liệu. Vui lòng thử lại!');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onSuccess]);

  const showDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCancel = () => {
    setIsDrawerOpen(false);
    setAuctionId(null);
    setDrawerMode('create');
  };

  const handleView = (value) => {
    console.log('View auctionId', value);

    setIsDrawerOpen(true);
    setAuctionId(value);
    setDrawerMode('update');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'auctionId',
      key: 'id',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time) => new Date(time).toLocaleString(),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (time) => new Date(time).toLocaleString(),
    },
    {
      title: 'Giá khởi điểm',
      dataIndex: 'startPrice',
      key: 'startingPrice',
      render: (price) => (price ? `${price.toLocaleString()} VND` : ''),
    },
    {
      title: 'Giá cuối',
      dataIndex: 'finalPrice',
      key: 'finalPrice',
      render: (price) => (price ? `${price.toLocaleString()} VND` : ''),
    },
    {
      title: 'Phương thức',
      dataIndex: 'method',
      key: 'method',
      render: (method) =>
        method === 'Ascending'
          ? 'Trả giá lên'
          : method === 'Descending'
          ? 'Bỏ giá xuống'
          : method === 'Fixed-price'
          ? 'Giá cố định'
          : method === 'First-come'
          ? 'Trả giá một lần'
          : method,
    },
    {
      title: 'Số lượng cá',
      dataIndex: 'koiInfoList',
      key: 'fishCount',
      render: (fishList) => (Array.isArray(fishList) ? fishList.length : 0),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) =>
        status === 'Ongoing'
          ? 'Đang diễn ra'
          : status === 'Closed'
          ? 'Đã kết thúc'
          : status === 'Pending'
          ? 'Đang kiểm duyệt'
          : status === 'Scheduled'
          ? 'Sắp diễn ra'
          : status === 'Reject' // Rejected
          ? 'Bị từ chối'
          : status === 'Canceled'
          ? 'Đã hủy'
          : status === 'Failed'
          ? 'Thất bại'
          : status === 'Paid'
          ? 'Đã thanh toán'
          : status === 'Finished'
          ? 'Thành công'
          : status,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div key={record?.auctionId}>
          <Button type="link" onClick={() => handleView(record?.auctionId)}>
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.auctionContainer}>
      <Button type="primary" onClick={showDrawer} style={{ marginBottom: 16 }} className={styles.addBtn}>
        Tạo đấu giá mới
      </Button>
      <Table
        columns={columns}
        dataSource={auctionData}
        pagination={auctionData?.length > 10 || false}
        rowClassName="auction-row"
        loading={loading}
      />
      {pagination.totalItem > 1 && (
        <div className={styles.pagination}>
          <Pagination
            defaultCurrent={page + 1}
            pageSize={size}
            total={pagination.totalItem}
            onChange={(page) => setPage(page - 1)}
            showSizeChanger
            pageSizeOptions={['6', '12', '24', '48']}
            onShowSizeChange={(current, size) => setSize(size)}
          />
        </div>
      )}
      <AuctionForm
        open={isDrawerOpen}
        onCancel={handleCancel}
        auctionId={auctionId}
        mode={drawerMode}
        onSuccess={() => setOnSuccess(onSuccess + 1)}
      />
    </div>
  );
};

export default AuctionManage;
