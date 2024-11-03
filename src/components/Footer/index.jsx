import React from 'react';
import { Layout, Flex, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import styles from './index.module.scss';

const { Footer: AntFooter } = Layout;

function Footer() {
  const { t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <AntFooter className={styles.footer}>
      <div className={styles.footerBlur}>
        <div className={styles.container}>
          <Flex className={styles.settingGroup} justify="center">
            <Space size="large">
              <p style={{ color: 'red' }} onClick={() => changeLanguage('vi-VN')}>
                Tiếng Việt
              </p>
              <p onClick={() => changeLanguage('en-US')}>English</p>
              <p>中文</p>
              <p>한국어</p>
              <p onClick={() => changeLanguage('ja-JP')}>日本語</p>
            </Space>
          </Flex>

          <Flex className={styles.contactInfo} justify="center">
            <Space size="large">
              <p>{t('component.footer.contact.email')}</p>
              <p>{t('component.footer.contact.phone')}</p>
            </Space>
          </Flex>

          <Flex className={styles.legalLinks} justify="center">
            <Space size="large">
              <p href="/privacy-policy">{t('component.footer.legal.privacy_policy')}</p>
              <p href="/terms-of-service">{t('component.footer.legal.terms_of_service')}</p>
              <p href="/refund-policy">{t('component.footer.legal.refund_policy')}</p>
            </Space>
          </Flex>

          <Flex className={styles.copyRight} vertical align="center">
            <p>{t('component.footer.copyright')}</p>
            <p>{t('component.footer.powered_by')}</p>
          </Flex>
        </div>
      </div>
    </AntFooter>
  );
}

export default Footer;
