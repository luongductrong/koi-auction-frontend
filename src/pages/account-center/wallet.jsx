import React, { useEffect, useState } from 'react';
import { Layout, Card, Button, Table } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { InputModal } from '../../components/Modal';
import api from '../../configs';
import styles from './wallet.module.scss';

const { Content } = Layout;

function Wallet() {
  const [walletAmount, setWalletAmount] = useState(0);
  const [topupAmount, setTopupAmount] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [topupBtn, setTopupBtn] = useState(false);

  useEffect(() => {
    const fetchWalletAmount = async () => {
      try {
        const response = await api.get('/wallet/get-wallet', {
          requiresAuth: true,
        });
        setWalletAmount(response.data.amount);
      } catch (error) {
        console.error('Failed to fetch wallet amount:', error);
      }
    };

    const fetchTransactionHistory = async () => {
      try {
        const response = await api.get('/wallet/transactions', {
          requiresAuth: true,
        });
        setTransactionHistory(response.data);
      } catch (error) {
        console.error('Failed to fetch transaction history:', error);
      }
    };

    fetchWalletAmount();
    fetchTransactionHistory();
  }, []);

  useEffect(() => {
    const topup = async () => {
      try {
        const response = await api.post('/wallet/add-funds?amount=1000', {
          amount: '1000',
          requiresAuth: true,
        });
        console.log('Top-up response:', response.data);
      } catch (error) {
        console.error('Failed to top-up:', error);
      }
    };

    if (topupAmount > 0) {
      topup();
    }
  }, [topupAmount]);

  const columns = [
    {
      title: 'ID Giao dịch',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (text) => text.toLocaleString(),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Thành công', value: 'Completed' },
        { text: 'Đang xử lí', value: 'Pending' },
        { text: 'Thất bại', value: 'Failed' },
        { text: 'Khác', value: 'Other' },
      ],
      onFilter: (value, record) => {
        if (value === 'Other') {
          return !['Completed', 'Pending', 'Failed'].includes(record.status);
        }
        return record.status === value;
      },
      render: (text) => (text === 'Completed' ? 'Thành công' : text === 'Pending' ? 'Đang xử lí' : text),
    },
    {
      title: 'Loại giao dịch',
      dataIndex: 'transactionType',
      key: 'transactionType',
      filters: [
        { text: 'Nạp tiền', value: 'Top-up' },
        { text: 'Rút tiền', value: 'Withdraw' },
        { text: 'Thanh toán', value: 'Payment' },
        { text: 'Cọc tiền', value: 'Deposit' },
        { text: 'Hoàn cọc', value: 'Refund' },
        { text: 'Khác', value: 'Other' },
      ],
      onFilter: (value, record) => {
        if (value === 'Other') {
          return !['Top-up', 'Withdraw', 'Payment', 'Deposit', 'Refund'].includes(record.transactionType);
        }
        return record.transactionType === value;
      },
      render: (text) =>
        text === 'Top-up'
          ? 'Nạp tiền'
          : text === 'Withdraw'
          ? 'Rút tiền'
          : text === 'Payment'
          ? 'Thanh toán'
          : text === 'Deposit'
          ? 'Cọc tiền'
          : text === 'Refund'
          ? 'Hoàn cọc'
          : text,
    },
  ];

  return (
    <Layout>
      <div className={styles.header}>
        <h5>Ví của tôi</h5>
      </div>
      <Content className={styles.walletContent}>
        <div className={styles.walletContainer}>
          <Card className={styles.balanceCard} bordered>
            <div className={styles.balanceInfo}>
              <DollarOutlined style={{ fontSize: '48px', color: '#e60000' }} />
              <h1>{walletAmount.toLocaleString()}</h1>
            </div>
            <Button type="primary" className={styles.depositButton} onClick={() => setTopupBtn(!topupBtn)}>
              Nạp tiền
            </Button>
            <Button type="default" className={styles.withdrawButton}>
              Gửi yêu cầu rút tiền
            </Button>
          </Card>

          <Card className={styles.historyCard} bordered title="Lịch sử giao dịch">
            <Table dataSource={transactionHistory} columns={columns} pagination={{ pageSize: 5 }} rowKey="id" />
          </Card>
        </div>
      </Content>
    </Layout>
  );
}

export default Wallet;
