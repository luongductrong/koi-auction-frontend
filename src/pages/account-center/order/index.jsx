import { useState } from 'react';
import { Layout, Table, Tag, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './order.module.scss';

const { Content } = Layout;

function Order() {
  const [orders, setOrders] = useState([
    {
      key: '1',
      orderId: 'ORD123',
      customerName: 'Nguyễn Văn A',
      status: 'Đã giao',
      createdAt: '2023-10-01',
    },
    {
      key: '2',
      orderId: 'ORD124',
      customerName: 'Trần Thị B',
      status: 'Chưa giao',
      createdAt: '2023-10-02',
    },
    {
      key: '3',
      orderId: 'ORD125',
      customerName: 'Lê Văn C',
      status: 'Đang giao',
      createdAt: '2023-10-03',
    },
  ]);

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === 'Chưa giao') {
          color = 'volcano';
        } else if (status === 'Đang giao') {
          color = 'blue';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} type="primary">
            Sửa
          </Button>
          <Button icon={<DeleteOutlined />} type="danger" onClick={() => handleDelete(record.key)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleDelete = (key) => {
    const newOrders = orders.filter((order) => order.key !== key);
    setOrders(newOrders);
  };

  return (
    <Layout>
      <Content className={styles.content}>
        <h2 className={styles.title}>Quản lý đơn hàng</h2>
        <Table columns={columns} dataSource={orders} />
      </Content>
    </Layout>
  );
}

export default Order;
