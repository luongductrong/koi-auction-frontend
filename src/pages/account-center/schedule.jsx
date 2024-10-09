import React from 'react';
import { Layout, Card, Button, Segmented } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from './schedule.module.scss';

const { Header, Content } = Layout;

function Schedule() {
  return (
    <>
      <div className={styles.header}>
        <h5>Lịch biểu</h5>
      </div>
      <div className={styles.scheduleContent}>
        <Card className={styles.scheduleCard}>
          <div className={styles.scheduleControls}>
            <Button icon={<LeftOutlined />} shape="circle" />
            <Button icon={<RightOutlined />} shape="circle" />
            <Button className={styles.todayButton}>Hôm nay</Button>
            <Segmented
              className={styles.viewToggle}
              options={['Tháng', 'Tuần', 'Ngày', 'Lịch biểu']}
              defaultValue="Tháng"
            />
          </div>
          <div className={styles.noSchedule}>
            <p>Chưa có lịch trong tháng này</p>
          </div>
        </Card>
      </div>
    </>
  );
}

export default Schedule;
