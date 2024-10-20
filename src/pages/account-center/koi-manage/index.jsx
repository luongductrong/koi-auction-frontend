import React, { useState } from 'react';
import { Table, Button, Image } from 'antd';
import KoiForm from '../../../components/KoiForm';

const KoiManage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [koiData, setKoiData] = useState([
    {
      key: '1',
      name: 'Cá Koi 1',
      type: 'Loại 1',
      origin: 'Nhật Bản',
      status: 'Đang nuôi',
      image: 'https://example.com/koi1.jpg', // Đường dẫn ảnh
    },
    {
      key: '2',
      name: 'Cá Koi 2',
      type: 'Loại 2',
      origin: 'Việt Nam',
      status: 'Bán',
      image: 'https://example.com/koi2.jpg', // Đường dẫn ảnh
    },
  ]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreate = (newData) => {
    const newKey = (koiData.length + 1).toString();
    const updatedKoiData = [...koiData, { key: newKey, ...newData }];
    setKoiData(updatedKoiData);
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <Image width={80} src={image} alt="Koi image" />, // Hiển thị ảnh
    },
    {
      title: 'Tên cá',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 'bold' }}>{text}</span>
          <span>Loại: {record.type}</span>
          <span>Nguồn gốc: {record.origin}</span>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button type="link">Chỉnh sửa</Button>
          <Button type="link" danger>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
        Thêm cá Koi mới
      </Button>
      <Table columns={columns} dataSource={koiData} pagination={false} rowClassName="koi-row" />
      <KoiForm visible={isModalVisible} onCreate={handleCreate} onCancel={handleCancel} />
    </div>
  );
};

export default KoiManage;
