import React, { useEffect, useState } from 'react';
import { Table, Button, Image, App, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../../configs';
import KoiForm from '../../../components/KoiForm';
import styles from './koi.module.scss';
import defaultImage from '../../../assets/images/400x400.svg';

const KoiManage = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [koiData, setKoiData] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 0, totalPage: 0, totalItem: 0 });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [koiId, setKoiId] = useState(null);
  const [drawerMode, setDrawerMode] = useState('create');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/koi-fish?page=${page}&size=${size}`, {
          requiresAuth: true,
          onUnauthorizedCallback: () => {
            message.error('Phiên đăng nhập hết hạn!');
            navigate('/login');
          },
        });
        if (response?.data?.koi) {
          setKoiData(response.data.koi);
          setPagination({
            currentPage: response.data.currentPage,
            totalPage: response.data.totalPages,
            totalItem: response.data.totalElements,
          });
        } else {
          throw new Error("Can't get koi data");
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        message.error('Lỗi khi tải dữ liệu. Vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, size]);

  const showDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCancel = () => {
    setIsDrawerOpen(false);
    setKoiId(null);
    setDrawerMode('create');
  };

  const handleView = (value) => {
    setIsDrawerOpen(true);
    setKoiId(value);
    setDrawerMode('update');
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'headerImageUrl',
      key: 'image',
      render: (image) => <Image width={80} src={image ? image : defaultImage} alt="Koi image" />,
    },
    {
      title: 'Tên cá',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 'bold' }}>{text}</span>
          <span>Loại: {record?.koiTypeID || 'Không xác định'}</span>
          <span>Nguồn gốc: {record?.countryID || 'Không xác định'}</span>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) =>
        status === 'Active' ? 'Có sẵn' : status === 'Sold' ? 'Đã bán' : status === 'Selling' ? 'Đang bán' : status,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
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
    <div className={styles.koiContainer}>
      <Button type="primary" onClick={showDrawer} style={{ marginBottom: 16 }} className={styles.addBtn}>
        Thêm cá Koi mới
      </Button>
      <Table
        columns={columns}
        dataSource={Array.isArray(koiData) ? koiData.map((item) => ({ ...item, key: item.id })) : []}
        pagination={false} // Tắt pagination mặc định của Table
        rowClassName="koi-row"
        loading={loading}
      />
      {pagination.totalItem > 1 && (
        <div className={styles.pagination}>
          <Pagination
            defaultCurrent={page + 1}
            pageSize={size}
            total={pagination.totalItem}
            onChange={(page) => setPage(page - 1)} // Tính lại page khi thay đổi
            showSizeChanger
            pageSizeOptions={['6', '12', '24', '48']}
            onShowSizeChange={(current, size) => setSize(size)} // Chuyển đổi số lượng hiển thị trên mỗi trang
          />
        </div>
      )}
      <KoiForm open={isDrawerOpen} onCancel={handleCancel} koiId={koiId} mode={drawerMode} />
    </div>
  );
};

export default KoiManage;
