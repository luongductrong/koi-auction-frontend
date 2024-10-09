import React from 'react';
import { Layout, Card, Button, Pagination } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import styles from './wallet.module.scss';

const { Content } = Layout;

function Wallet() {
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
              <h1>0</h1>
            </div>
            <Button type="primary" className={styles.depositButton}>
              Nạp tiền
            </Button>
            <Button type="default" className={styles.withdrawButton}>
              Gửi yêu cầu rút tiền
            </Button>
          </Card>

          <Card className={styles.historyCard} bordered title="Lịch sử giao dịch">
            <div className={styles.transactionHistory}>{/* Thêm dữ liệu lịch sử giao dịch tại đây */}</div>
            <Pagination size="small" total={50} showSizeChanger={false} />
          </Card>
        </div>
      </Content>
    </Layout>
  );
}

export default Wallet;
