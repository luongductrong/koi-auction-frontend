import React from 'react';
import { Layout, Flex, Space } from 'antd';
import styles from './index.module.scss';

const { Footer: AntFooter } = Layout;

function Footer() {
  return (
    <AntFooter className={styles.footer}>
      <div className={styles.footerBlur}>
        <div className={styles.container}>
          <Flex className={styles.settingGroup} justify="center">
            <Space size="large">
              <p>Tiếng Việt</p>
              <p>English</p>
              <p>中文</p>
              <p>한국어</p>
              <p>日本語</p>
            </Space>
          </Flex>

          <Flex className={styles.contactInfo} justify="center">
            <Space size="large">
              <p>
                <strong>Email:</strong> support@example.com
              </p>
              <p>
                <strong>Phone:</strong> +84 123 456 789
              </p>
            </Space>
          </Flex>

          <Flex className={styles.legalLinks} justify="center">
            <Space size="large">
              <p href="/privpcy-policy">Chính sách bảo mật</p>
              <p href="/terms-of-service">Điều khoản dịch vụ</p>
              <p href="/refund-policy">Chính sách hoàn tiền</p>
            </Space>
          </Flex>

          <Flex className={styles.copyRight} vertical align="center">
            <p>© 2024 Software development project</p>
            <p>Powered by Ant Design</p>
          </Flex>
        </div>
      </div>
    </AntFooter>
  );
}

export default Footer;
