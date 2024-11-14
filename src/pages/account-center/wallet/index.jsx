import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Card, Button, Table, App, Spin } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { InputModal } from '../../../components/Modal';
import api from '../../../configs';
import styles from './wallet.module.scss';

const { Content } = Layout;

function Wallet() {
  const { message } = App.useApp();
  const [walletAmount, setWalletAmount] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  console.log('Wallet render');

  useEffect(() => {
    const clearURLParams = () => {
      const url = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, url);
    };
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    const amount = params.get('amount');

    if (success === 'true' && amount !== '') {
      message.success(`Nạp tiền thành công! Số tiền: ${Number(amount).toLocaleString('vi-VN')} VND`);
      clearURLParams();
    } else if (success === 'false') {
      message.error('Nạp tiền thất bại! Vui lòng thử lại sau.');
      clearURLParams();
    }
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [walletResponse, transactionResponse] = await Promise.all([
          api.get('/wallet/get-wallet', {
            requiresAuth: true,
            onUnauthorizedCallback: () => {
              message.error('Phiên đăng nhập hết hạn!');
              navigate('/login');
            },
          }),
          api.get('/wallet/transactions', { requiresAuth: true }),
        ]);

        if (walletResponse.data.amount !== walletAmount) {
          setWalletAmount(walletResponse.data.amount);
        }

        if (JSON.stringify(transactionResponse.data) !== JSON.stringify(transactionHistory)) {
          setTransactionHistory(transactionResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const topup = async (value) => {
    try {
      const response = await api.post(`/wallet/add-funds?amount=${value}&callbackUrl=${window.location.href}`, null, {
        requiresAuth: true,
      });
      window.location.href = response.data.message;
    } catch (error) {
      console.error('Failed to top-up:', error);
    }
  };

  const withdraw = async (value) => {
    try {
      const response = await api.post(`/wallet/withdraw?amount=${value}`, null, { requiresAuth: true });
      message.success('Gửi yêu cầu thành công, chúng tôi sẽ sớm liên hệ trong thời gian sớm nhất!');
      console.log('Withdraw Response:', response.data);
    } catch (error) {
      console.error('Failed to withdraw:', error);
    }
  };

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
        {loading ? (
          <Spin size="large" className={styles.loading} tip="Đang tải"></Spin>
        ) : (
          <div className={styles.walletContainer}>
            <Card className={styles.balanceCard} bordered>
              <div className={styles.balanceInfo}>
                <DollarOutlined style={{ fontSize: '48px', color: '#e60000' }} />
                <h1>{walletAmount.toLocaleString()}</h1>
              </div>
              <InputModal
                inputType="number"
                buttonTitle="Nạp tiền"
                label="Nạp tiền"
                placeholder="Nhập số tiền muốn nạp..."
                message="Vui lòng nhập số tiền!"
                btnClassName={styles.depositButton}
                onOk={(value) => topup(value)}
              />
              <InputModal
                inputType="number"
                buttonTitle="Rút tiền"
                label="Rút tiền"
                placeholder="Nhập số tiền muốn rút..."
                message="Vui lòng nhập số tiền!"
                btnClassName={styles.withdrawButton}
                onOk={(value) => withdraw(value)}
              />
            </Card>

            <Card className={styles.historyCard} bordered title="Lịch sử giao dịch">
              <Table dataSource={transactionHistory} columns={columns} pagination={{ pageSize: 5 }} rowKey="id" />
            </Card>
          </div>
        )}
      </Content>
    </Layout>
  );
}

export default Wallet;
