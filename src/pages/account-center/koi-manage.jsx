// KoiManage.jsx
import React, { useState } from 'react';
import { Table, Button } from 'antd';
import KoiForm from '../../components/KoiForm';

const KoiManage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [koiData, setKoiData] = useState([
    {
      key: '1',
      name: 'Cá Koi 1',
      type: 'Loại 1',
      origin: 'Nhật Bản',
      status: 'Đang nuôi',
    },
    {
      key: '2',
      name: 'Cá Koi 2',
      type: 'Loại 2',
      origin: 'Việt Nam',
      status: 'Bán',
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
      title: 'Tên cá',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Loại cá',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Nguồn gốc',
      dataIndex: 'origin',
      key: 'origin',
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
      <Table columns={columns} dataSource={koiData} />

      <KoiForm visible={isModalVisible} onCreate={handleCreate} onCancel={handleCancel} />
    </div>
  );
};

export default KoiManage;
