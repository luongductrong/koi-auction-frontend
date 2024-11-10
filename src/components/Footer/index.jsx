import React, { useState } from 'react';
import { Layout, Flex, Space } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import styles from './index.module.scss';

const { Footer: AntFooter } = Layout;
const langStyle = { color: 'red', textShadow: '2px 2px 4px #333333' };

function Footer() {
  const { t } = useTranslation();
  let lang = localStorage.getItem('i18nextLng');
  if (lang === 'vi') {
    lang = 'vi-VN';
  } else if (lang === 'en') {
    lang = 'en-US';
  } else if (lang === 'ja') {
    lang = 'ja-JP';
  } else if (lang === 'zh') {
    lang = 'zh-CN';
  } else if (lang === 'th') {
    lang = 'th-TH';
  }
  const [language, setLanguage] = useState(lang);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  return (
    <AntFooter className={styles.footer}>
      <div className={styles.footerBlur}>
        <div className={styles.container}>
          <Flex className={styles.settingGroup} justify="center">
            <Space size="large">
              <p
                style={language === 'vi-VN' ? langStyle : { cursor: 'pointer' }}
                onClick={() => changeLanguage('vi-VN')}
              >
                Tiếng Việt
              </p>
              <p
                style={language === 'en-US' ? langStyle : { cursor: 'pointer' }}
                onClick={() => changeLanguage('en-US')}
              >
                English
              </p>
              <p
                style={language === 'ja-JP' ? langStyle : { cursor: 'pointer' }}
                onClick={() => changeLanguage('ja-JP')}
              >
                日本語
              </p>
              <p
                style={language === 'zh-CN' ? langStyle : { cursor: 'pointer' }}
                onClick={() => changeLanguage('zh-CN')}
              >
                中文
              </p>
              <p
                style={language === 'th-TH' ? langStyle : { cursor: 'pointer' }}
                onClick={() => changeLanguage('th-TH')}
              >
                ภาษาไทย
              </p>
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
              <Link to="/policy?tab=privacy">{t('component.footer.legal.privacy_policy')}</Link>
              <Link to="/policy?tab=terms">{t('component.footer.legal.terms_of_service')}</Link>
              <Link to="/policy?tab=refund">{t('component.footer.legal.refund_policy')}</Link>
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
