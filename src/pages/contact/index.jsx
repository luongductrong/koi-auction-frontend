import React from 'react';
import { Typography, Layout, Row, Col, Card, Space } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { FacebookOutlined, InstagramOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

function ContactPage() {
  const { t } = useTranslation();
  return (
    <Layout style={{ backgroundColor: 'transparent' }}>
      <Content>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={1} style={{ color: 'var(--primary-color)', textAlign: 'center' }}>
            {t('page.contact.page_title')}
          </Title>

          <Row gutter={[32, 32]}>
            <Col span={24}>
              <Card
                title={
                  <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                    {t('page.contact.contact_info')}
                  </span>
                }
                bordered={false}
              >
                <Space direction="vertical" align="center" size="middle" style={{ width: '100%' }}>
                  <Paragraph>
                    <MailOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
                    {`${t('page.contact.email')}: support@example.com`}
                  </Paragraph>
                  <Paragraph>
                    <PhoneOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
                    {`${t('page.contact.phone')}: 0123 456 789`}
                  </Paragraph>
                  <Paragraph>
                    <EnvironmentOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
                    {`${t('page.contact.address')}: ${t('page.contact.address_details')}`}
                  </Paragraph>
                  <Paragraph>
                    <FacebookOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
                    {`${t('page.contact.facebook')}: /koiauction`}
                  </Paragraph>
                  <Paragraph>
                    <InstagramOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
                    {`${t('page.contact.instagram')}: @koiauction`}
                  </Paragraph>
                </Space>
              </Card>

              <Card
                title={
                  <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                    {t('page.contact.headquarters')}
                  </span>
                }
                style={{ marginTop: 16 }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.858181237279!2d106.80048060349132!3d10.874984647344146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a6b19d6763%3A0x143c54525028b2e!2zTmjDoCBWxINuIGjDs2EgU2luaCB2acOqbiBUUC5IQ00!5e0!3m2!1svi!2s!4v1731196546563!5m2!1svi!2s"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </Card>
            </Col>

            {/* <Col span={24}>
              <Card
                title={
                  <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                    {t('page.contact.feedback_form')}
                  </span>
                }
                bordered={false}
              >
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSewbH4dHEjraw0HVRSOtnDADzci1X2HsL_rMd4xHv-ml4JyPg/viewform?embedded=true"
                  width="100%"
                  height="1100"
                  frameborder="0"
                  marginheight="0"
                  marginwidth="0"
                >
                  {t('page.contact.loading_text')}
                </iframe>
              </Card>
            </Col> */}
          </Row>
        </Space>
      </Content>
    </Layout>
  );
}

export default ContactPage;
