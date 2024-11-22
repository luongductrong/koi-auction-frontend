import React, { useEffect, useState } from 'react';
import { Layout, Table, Tag, Button, Space, App, Spin } from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';
import api from '../../../configs';
import styles from './order.module.scss';

const { Content } = Layout;

function Order() {
  const user = useSelector((state) => state.user.user);
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [fetch, setFetch] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get('/order', { requiresAuth: true });
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        message.error('Lỗi khi tải danh sách đơn hàng!');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user, fetch]);

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        return (
          <Tag color={color}>
            {status === 'Pending'
              ? 'Đang chuẩn bị'
              : status === 'Shipping'
              ? 'Đang giao'
              : status === 'Done'
              ? 'Hoàn thành'
              : status === 'Dispute'
              ? 'Tranh chấp'
              : status}
          </Tag>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Mã đấu giá',
      dataIndex: 'auctionId',
      key: 'auctionId',
    },
    {
      title: 'Loại đơn hàng',
      dataIndex: 'bidderId',
      key: 'bidderId',
      render: (bidderId) => {
        return bidderId != user?.userId ? 'Đơn gửi' : 'Đơn nhận';
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        if (
          (record.bidderId === user?.userId && record.status === 'Shipping') ||
          (record.bidderId !== user?.userId && record.status === 'Pending')
        ) {
          return (
            <Space size="middle">
              <Button type="primary" ghost onClick={() => handleDone(record)} loading={btnLoading}>
                {record.bidderId === user?.userId ? 'Đã nhận được hàng' : 'Xác nhận đã giao'}
              </Button>
            </Space>
          );
        }
      },
    },
  ];

  const handleDone = async (order) => {
    try {
      setBtnLoading(true);
      console.log('Order:', `/order/${order.orderId}/${user?.userId === order?.bidderId ? 'done' : 'shipping'}`);
      const response = await api.post(
        `/order/${order.orderId}/${user?.userId === order?.bidderId ? 'done' : 'shipping'}`,
        null,
        {
          requiresAuth: true,
        },
      );
      if (response) {
        message.success('Đã hoàn thành đơn hàng!');
        setFetch(!fetch);
      }
    } catch (error) {
      console.error('Failed to mark order as done:', error);
      message.error('Đánh dấu đơn hàng hoàn thành thất bại!');
    } finally {
      setBtnLoading(false);
    }
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
