import React, { useEffect, useState } from 'react';
import { Table, Button, App } from 'antd';
import api from '../../../configs';
import AuctionForm from '../../../components/AuctionForm';
import styles from './auction.module.scss';

const AuctionManage = () => {
  const { message } = App.useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [auctionData, setAuctionData] = useState([]);
  const [auctionId, setAuctionId] = useState(null);
  const [drawerMode, setDrawerMode] = useState('create');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/auction/filter?page=0&size=10&desc=DESC');
        if (response?.data?.auctions) {
          setAuctionData(response.data.auctions);
          console.log('Auction:', response.data.auctions);
        } else {
          throw new Error("Can't get auction data");
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        message.error('Lỗi khi tải dữ liệu. Vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCancel = () => {
    setIsDrawerOpen(false);
    setAuctionId(null);
    setDrawerMode('create');
  };

  const handleView = (value) => {
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
          : status === 'Reject'
          ? 'Bị từ chối'
          : status,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button type="link" onClick={() => handleView(record?.id)}>
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
        pagination={auctionData?.length > 10}
        rowClassName="auction-row"
        loading={loading}
      />
      <AuctionForm open={isDrawerOpen} onCancel={handleCancel} auctionId={auctionId} mode={drawerMode} />
    </div>
  );
};

export default AuctionManage;
