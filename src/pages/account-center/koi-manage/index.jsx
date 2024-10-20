import React, { useEffect, useState } from 'react';
import { Table, Button, Image } from 'antd';
import api from '../../../configs';
import KoiForm from '../../../components/KoiForm';
import styles from './koi.module.scss';
import defaultImage from '../../../assets/images/400x400.svg';

const KoiManage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [koiData, setKoiData] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log('Koi Manage render');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/koi-fish/get-koi-active');
        setKoiData(response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
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
          <span>Loại: {record.koiTypeID}</span>
          <span>Nguồn gốc: {record.countryID}</span>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) =>
        status === 'Active' ? 'Có sẵn' : status === 'Sold' ? 'Đã bán' : status === 'For-sale' ? 'Đang bán' : status,
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
          <Button type="link">Chi tiết</Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.koiContainer}>
      <Button type="primary" onClick={showDrawer} style={{ marginBottom: 16 }} className={styles.addBtn}>
        Thêm cá Koi mới
      </Button>
      <Table columns={columns} dataSource={koiData} pagination={true} rowClassName="koi-row" loading={loading} />
      <KoiForm open={isDrawerOpen} onCancel={handleCancel} />
    </div>
  );
};

export default KoiManage;
